import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const session_id = searchParams.get('session_id')

    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID manquant' },
        { status: 400 }
      )
    }

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

    if (!STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY manquante')
      return NextResponse.json(
        { error: 'Configuration Stripe manquante' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia' as any
    })

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id)

    return NextResponse.json(session)

  } catch (error: any) {
    console.error('❌ Erreur récupération session Stripe:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération de la session' },
      { status: 500 }
    )
  }
}
