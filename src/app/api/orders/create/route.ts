import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { getStripeSecretKey } from '@/config/stripe'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API /api/orders/create appelée')

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId requis' },
        { status: 400 }
      )
    }

    // Initialiser Stripe
    const STRIPE_SECRET_KEY = getStripeSecretKey()
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia' as any
    })

    // Récupérer la session Stripe
    console.log('🔍 Récupération session Stripe:', sessionId)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Paiement non confirmé' },
        { status: 400 }
      )
    }

    console.log('✅ Paiement confirmé')

    // Créer le client Supabase
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnkomglhvrwaddshwjff.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBua29tZ2xodnJ3YWRkc2h3amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTMwMDEsImV4cCI6MjA3NDM2OTAwMX0.IakWiHM3bIjAm03DDv9GvF7PIGgpmMoU2JveB0DMbr4'
    )

    // Extraire les métadonnées
    const metadata = session.metadata || {}
    const customerEmail = session.customer_email || session.customer_details?.email
    const items = JSON.parse(metadata.items || '[]')
    const shippingAddress = JSON.parse(metadata.shippingAddress || '{}')

    console.log('📦 Items:', items.length)
    console.log('📧 Email:', customerEmail)

    // Récupérer ou créer l'utilisateur
    let userId: string | null = null

    if (customerEmail) {
      // Chercher l'utilisateur par email
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', customerEmail)
        .single()

      if (existingUser) {
        userId = existingUser.id
        console.log('✅ Utilisateur trouvé:', userId)
      } else {
        // Créer un nouvel utilisateur si nécessaire
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            email: customerEmail,
            first_name: metadata.customerFirstName || 'Invité',
            last_name: metadata.customerLastName || '',
            phone: metadata.customerPhone || '',
            role: 'customer'
          })
          .select('id')
          .single()

        if (userError) {
          console.error('❌ Erreur création utilisateur:', userError)
        } else if (newUser) {
          userId = newUser.id
          console.log('✅ Utilisateur créé:', userId)
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Impossible de trouver ou créer l\'utilisateur' },
        { status: 500 }
      )
    }

    // Générer un numéro de commande
    const orderNumber = `SH-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Calculer le total
    const totalAmount = (session.amount_total || 0) / 100 // Convertir de centimes en euros

    // Créer la commande
    console.log('📝 Création de la commande...')
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        status: 'confirmed',
        total_amount: totalAmount.toString(),
        shipping_address: `${shippingAddress.address}, ${shippingAddress.postalCode} ${shippingAddress.city}, ${shippingAddress.country}`
      })
      .select('id')
      .single()

    if (orderError) {
      console.error('❌ Erreur création commande:', orderError)
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 500 }
      )
    }

    console.log('✅ Commande créée:', order.id)

    // Créer les items de la commande
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      variant_id: item.variantId,
      size_id: item.sizeId,
      quantity: item.quantity,
      price: item.price.toString()
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('❌ Erreur création items:', itemsError)
      return NextResponse.json(
        { success: false, error: itemsError.message },
        { status: 500 }
      )
    }

    console.log('✅ Items créés:', orderItems.length)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: orderNumber
    })

  } catch (error) {
    console.error('❌ Erreur API:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
