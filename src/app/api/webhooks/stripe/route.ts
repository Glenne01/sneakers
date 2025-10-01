import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      )
    }

    // Vérifier la signature du webhook
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Erreur vérification signature webhook:', err.message)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Traiter l'événement
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('✅ Paiement réussi:', session.id)

        // Récupérer les métadonnées
        const metadata = session.metadata
        if (!metadata) {
          console.error('❌ Métadonnées manquantes')
          break
        }

        const items = JSON.parse(metadata.items || '[]')
        const shippingAddress = JSON.parse(metadata.shippingAddress || '{}')

        // Créer ou récupérer l'utilisateur
        let userId: string | null = null

        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.customer_email)
          .single()

        if (existingUser) {
          userId = existingUser.id
        } else {
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
              email: session.customer_email,
              first_name: metadata.customerFirstName,
              last_name: metadata.customerLastName,
              phone: metadata.customerPhone,
              role: 'customer',
              is_active: true
            })
            .select('id')
            .single()

          if (userError) {
            console.error('❌ Erreur création utilisateur:', userError)
            break
          }
          userId = newUser.id
        }

        if (!userId) {
          console.error('❌ Impossible de créer/récupérer l\'utilisateur')
          break
        }

        // Générer un numéro de commande
        const orderNumber = `SH-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

        // Créer la commande
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            user_id: userId,
            status: 'confirmed',
            subtotal: (session.amount_subtotal || 0) / 100,
            shipping_cost: ((session.amount_total || 0) - (session.amount_subtotal || 0)) / 100,
            tax_amount: 0,
            total_amount: (session.amount_total || 0) / 100,
            currency: session.currency?.toUpperCase() || 'EUR',
            shipping_address: {
              first_name: metadata.customerFirstName,
              last_name: metadata.customerLastName,
              address: shippingAddress.address,
              city: shippingAddress.city,
              postal_code: shippingAddress.postalCode,
              country: shippingAddress.country,
              phone: metadata.customerPhone
            }
          })
          .select('id')
          .single()

        if (orderError) {
          console.error('❌ Erreur création commande:', orderError)
          break
        }

        // Créer les articles de la commande
        const orderItems = await Promise.all(
          items.map(async (item: any) => {
            // Récupérer les infos du variant
            const { data: variant } = await supabase
              .from('product_variants')
              .select('*, product:products(name)')
              .eq('id', item.variantId)
              .single()

            // Récupérer les infos de la taille
            const { data: size } = await supabase
              .from('sizes')
              .select('*')
              .eq('id', item.sizeId)
              .single()

            return {
              order_id: order.id,
              variant_id: item.variantId,
              size_id: item.sizeId,
              product_name: variant?.product?.name || '',
              variant_color: variant?.color || '',
              variant_sku: variant?.sku || '',
              size_value: size?.size_value || '',
              unit_price: item.price,
              quantity: item.quantity,
              line_total: item.price * item.quantity
            }
          })
        )

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems)

        if (itemsError) {
          console.error('❌ Erreur création articles commande:', itemsError)
          break
        }

        // Décrémenter le stock
        for (const item of items) {
          const { data: stockData, error: stockFetchError } = await supabase
            .from('product_stock')
            .select('id, quantity')
            .eq('variant_id', item.variantId)
            .eq('size_id', item.sizeId)
            .single()

          if (stockFetchError || !stockData) {
            console.error('❌ Erreur récupération stock:', stockFetchError)
            continue
          }

          const newQuantity = Math.max(0, stockData.quantity - item.quantity)
          const { error: stockUpdateError } = await supabase
            .from('product_stock')
            .update({
              quantity: newQuantity,
              updated_at: new Date().toISOString()
            })
            .eq('id', stockData.id)

          if (stockUpdateError) {
            console.error('❌ Erreur mise à jour stock:', stockUpdateError)
          }
        }

        // Créer le paiement
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            order_id: order.id,
            payment_method: 'stripe',
            status: 'completed',
            amount: (session.amount_total || 0) / 100,
            currency: session.currency?.toUpperCase() || 'EUR',
            transaction_id: session.payment_intent as string,
            processed_at: new Date().toISOString()
          })

        if (paymentError) {
          console.error('❌ Erreur création paiement:', paymentError)
        }

        console.log('✅ Commande créée avec succès:', orderNumber)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('✅ PaymentIntent réussi:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ PaymentIntent échoué:', paymentIntent.id)
        break
      }

      default:
        console.log(`⚠️ Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('❌ Erreur webhook Stripe:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur webhook' },
      { status: 500 }
    )
  }
}
