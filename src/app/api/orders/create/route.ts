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
    const { sessionId, authUserId } = body

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

    // Récupérer l'utilisateur
    let userId: string | null = null

    // Si authUserId est fourni (utilisateur connecté), utiliser celui-ci
    if (authUserId) {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', authUserId)
        .single()

      if (userData) {
        userId = userData.id
        console.log('✅ Utilisateur connecté trouvé:', userId)
      }
    }

    // Sinon, utiliser l'email du checkout
    if (!userId && customerEmail) {
      // Chercher l'utilisateur par email
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', customerEmail)
        .single()

      if (existingUser) {
        userId = existingUser.id
        console.log('✅ Utilisateur trouvé par email:', userId)
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

    // Créer les items de la commande - charger les infos produits
    const orderItemsPromises = items.map(async (item: any) => {
      // Récupérer les infos du variant et du produit
      const { data: variantData } = await supabase
        .from('product_variants')
        .select('color, sku, products(name)')
        .eq('id', item.variantId)
        .single()

      // Récupérer les infos de la taille
      const { data: sizeData } = await supabase
        .from('sizes')
        .select('size_value')
        .eq('id', item.sizeId)
        .single()

      const unitPrice = parseFloat(item.price)
      const lineTotal = unitPrice * item.quantity

      return {
        order_id: order.id,
        variant_id: item.variantId,
        size_id: item.sizeId,
        product_name: variantData?.products?.name || 'Produit',
        variant_color: variantData?.color || '',
        variant_sku: variantData?.sku || '',
        size_value: sizeData?.size_value || '',
        unit_price: unitPrice,
        quantity: item.quantity,
        line_total: lineTotal
      }
    })

    const orderItems = await Promise.all(orderItemsPromises)

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

    // Décrémenter les stocks
    console.log('📦 Décrémentation des stocks...')
    for (const item of items) {
      try {
        // Récupérer le stock actuel
        const { data: currentStock } = await supabase
          .from('product_stock')
          .select('id, quantity')
          .eq('variant_id', item.variantId)
          .eq('size_id', item.sizeId)
          .single()

        if (currentStock) {
          const newQuantity = Math.max(0, currentStock.quantity - item.quantity)

          // Mettre à jour le stock
          const { error: updateError } = await supabase
            .from('product_stock')
            .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
            .eq('id', currentStock.id)

          if (updateError) {
            console.error('⚠️ Erreur mise à jour stock:', updateError)
          } else {
            console.log(`✅ Stock mis à jour: variant ${item.variantId}, size ${item.sizeId}, ${currentStock.quantity} → ${newQuantity}`)
          }

          // Enregistrer le mouvement de stock
          await supabase
            .from('stock_movements')
            .insert({
              variant_id: item.variantId,
              size_id: item.sizeId,
              movement_type: 'out',
              quantity_change: -item.quantity,
              quantity_before: currentStock.quantity,
              quantity_after: newQuantity,
              reference_type: 'order',
              reference_id: order.id,
              reason: `Commande ${orderNumber}`
            })
        } else {
          console.warn(`⚠️ Stock non trouvé pour variant ${item.variantId}, size ${item.sizeId}`)
        }
      } catch (stockError) {
        console.error('⚠️ Erreur gestion stock (non bloquante):', stockError)
        // Ne pas bloquer la commande si la mise à jour du stock échoue
      }
    }

    console.log('✅ Stocks mis à jour')

    // Envoyer l'email de confirmation
    try {
      const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://sneakers-two-sigma.vercel.app'}/commandes`

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://sneakers-two-sigma.vercel.app'}/api/emails/send-order-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail,
          customerName: `${metadata.customerFirstName || ''} ${metadata.customerLastName || ''}`.trim(),
          orderNumber,
          orderDate: new Date().toLocaleDateString('fr-FR'),
          items: orderItems.map(item => ({
            productName: item.product_name,
            variantColor: item.variant_color,
            sizeValue: item.size_value,
            quantity: item.quantity,
            lineTotal: parseFloat(item.line_total.toString()),
          })),
          subtotal: orderItems.reduce((sum, item) => sum + parseFloat(item.line_total.toString()), 0),
          shipping: totalAmount - orderItems.reduce((sum, item) => sum + parseFloat(item.line_total.toString()), 0),
          total: totalAmount,
          orderUrl,
        }),
      })

      console.log('✅ Email de confirmation envoyé')
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email (non bloquante):', emailError)
      // Ne pas bloquer la création de commande si l'email échoue
    }

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
