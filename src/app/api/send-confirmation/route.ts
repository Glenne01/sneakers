import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des données requises
    const {
      orderNumber,
      customerName,
      customerEmail,
      items,
      subtotal,
      shipping,
      total,
      shippingAddress
    } = body

    if (!orderNumber || !customerName || !customerEmail || !items || !shippingAddress) {
      return NextResponse.json(
        { error: 'Données manquantes pour l\'envoi de l\'email' },
        { status: 400 }
      )
    }

    // Envoyer l'email de confirmation
    const emailSent = await sendOrderConfirmationEmail({
      orderNumber,
      customerName,
      customerEmail,
      items,
      subtotal,
      shipping,
      total,
      shippingAddress
    })

    if (emailSent) {
      return NextResponse.json({ success: true, message: 'Email de confirmation envoyé' })
    } else {
      return NextResponse.json(
        { error: 'Échec de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erreur dans l\'API send-confirmation:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}