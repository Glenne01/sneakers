import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/email/resend'
import { OrderConfirmationEmail } from '@/lib/email/templates/OrderConfirmationEmail'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    console.log('📧 API /api/emails/send-order-confirmation appelée')

    const body = await request.json()
    const {
      customerEmail,
      customerName,
      orderNumber,
      orderDate,
      items,
      subtotal,
      shipping,
      total,
      orderUrl,
    } = body

    if (!customerEmail || !orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      )
    }

    console.log('📧 Envoi email à:', customerEmail)

    // Pour le développement, on simule l'envoi
    // En production, décommenter le code Resend ci-dessous

    /*
    const { data, error } = await resend.emails.send({
      from: 'Sneakers Shop <noreply@sneakers-shop.com>',
      to: [customerEmail],
      subject: `Confirmation de commande ${orderNumber}`,
      html: OrderConfirmationEmail({
        customerName,
        orderNumber,
        orderDate,
        items,
        subtotal,
        shipping,
        total,
        orderUrl,
      }),
    })

    if (error) {
      console.error('❌ Erreur envoi email:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Email envoyé:', data.id)
    */

    // Simulation pour le développement
    console.log('✅ Email simulé (dev mode)')
    console.log('   To:', customerEmail)
    console.log('   Subject:', `Confirmation de commande ${orderNumber}`)

    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès (mode simulation)',
    })

  } catch (error) {
    console.error('❌ Erreur API email:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
