import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripeSecretKey, getAppUrl } from '@/config/stripe'

export async function POST(request: NextRequest) {
  console.log('🔧 API /api/checkout appelée')

  try {
    // Récupérer la clé Stripe (depuis env ou fallback)
    const STRIPE_SECRET_KEY = getStripeSecretKey()

    console.log('✅ Utilisation de la clé Stripe')

    // Initialiser Stripe
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia' as any
    })

    console.log('✅ Stripe initialisé')
    const body = await request.json()
    const { items, customerInfo, shippingAddress } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Aucun article dans le panier' },
        { status: 400 }
      )
    }

    // Calculer le total
    const subtotal = items.reduce((sum: number, item: any) =>
      sum + (item.variant.price * item.quantity), 0
    )
    const shipping = subtotal > 100 ? 0 : 9.99
    const total = subtotal + shipping

    // Créer les line items pour Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.variant.product?.name || 'Produit',
          description: `${item.variant.color} - Taille ${item.size.size_value}`,
          images: item.variant.image_url ? [item.variant.image_url] : []
        },
        unit_amount: Math.round(item.variant.price * 100) // Convertir en centimes
      },
      quantity: item.quantity
    }))

    // Ajouter les frais de livraison si nécessaire
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Frais de livraison',
            description: 'Livraison standard'
          },
          unit_amount: Math.round(shipping * 100)
        },
        quantity: 1
      })
    }

    // URL de l'application
    const APP_URL = getAppUrl()

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/checkout/cancel`,
      customer_email: customerInfo.email,
      metadata: {
        customerFirstName: customerInfo.firstName,
        customerLastName: customerInfo.lastName,
        customerPhone: customerInfo.phone,
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(items.map((item: any) => ({
          variantId: item.variant.id,
          sizeId: item.size.id,
          quantity: item.quantity,
          price: item.variant.price
        })))
      },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH']
      }
    })

    console.log('✅ Session créée:', session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error: any) {
    console.error('❌ Erreur création session Stripe:', error)
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    )
  }
}
