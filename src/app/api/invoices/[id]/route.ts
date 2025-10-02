import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import PDFDocument from 'pdfkit'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = (await params).id
    console.log('🔍 Génération facture pour commande:', orderId)

    // Créer le client Supabase
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnkomglhvrwaddshwjff.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBua29tZ2xodnJ3YWRkc2h3amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTMwMDEsImV4cCI6MjA3NDM2OTAwMX0.IakWiHM3bIjAm03DDv9GvF7PIGgpmMoU2JveB0DMbr4'
    )

    // Récupérer la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('❌ Erreur récupération commande:', orderError)
      return NextResponse.json(
        { success: false, error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    console.log('✅ Commande trouvée')

    // Récupérer l'utilisateur
    const { data: userData } = await supabase
      .from('users')
      .select('first_name, last_name, email')
      .eq('id', order.user_id)
      .single()

    // Récupérer les items
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    // Créer l'objet order avec les relations
    const orderWithRelations = {
      ...order,
      users: userData || null,
      order_items: orderItems || []
    }

    // Créer le PDF
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    doc.on('data', (chunk) => chunks.push(chunk))

    // Header
    doc
      .fontSize(24)
      .fillColor('#ff6b35')
      .text('SNEAKERS SHOP', 50, 50)
      .fontSize(10)
      .fillColor('#666666')
      .text('Email: contact@sneakers-shop.com', 50, 80)
      .text('Téléphone: +33 1 23 45 67 89', 50, 95)

    // Ligne de séparation
    doc
      .moveTo(50, 115)
      .lineTo(550, 115)
      .strokeColor('#ff6b35')
      .lineWidth(2)
      .stroke()

    // Titre FACTURE
    doc
      .fontSize(20)
      .fillColor('#000000')
      .text('FACTURE', 50, 135)

    // Informations facture
    doc
      .fontSize(10)
      .fillColor('#666666')
      .text('Numéro de facture', 50, 170)
      .fontSize(11)
      .fillColor('#000000')
      .text(orderWithRelations.order_number, 50, 185)

    doc
      .fontSize(10)
      .fillColor('#666666')
      .text('Date', 300, 170)
      .fontSize(11)
      .fillColor('#000000')
      .text(new Date(orderWithRelations.created_at).toLocaleDateString('fr-FR'), 300, 185)

    // Informations client
    doc
      .fontSize(12)
      .fillColor('#333333')
      .text('Facturé à', 50, 230)
      .fontSize(11)
      .fillColor('#000000')
      .text(`${orderWithRelations.users?.first_name || ''} ${orderWithRelations.users?.last_name || ''}`.trim(), 50, 250)
      .text(orderWithRelations.users?.email || '', 50, 265)
      .text(orderWithRelations.shipping_address || '', 50, 280)

    // Tableau des items
    const tableTop = 330
    doc
      .fontSize(12)
      .fillColor('#333333')
      .text('Détails de la commande', 50, tableTop)

    // En-têtes du tableau
    const headerY = tableTop + 25
    doc
      .fontSize(10)
      .fillColor('#000000')
      .rect(50, headerY, 500, 25)
      .fillAndStroke('#f5f5f5', '#dddddd')
      .fillColor('#000000')
      .text('Produit', 55, headerY + 8)
      .text('Couleur', 250, headerY + 8)
      .text('Taille', 340, headerY + 8)
      .text('Qté', 410, headerY + 8)
      .text('Total', 480, headerY + 8, { align: 'right', width: 60 })

    // Items
    let currentY = headerY + 30
    let subtotal = 0

    orderWithRelations.order_items.forEach((item: any) => {
      const lineTotal = parseFloat(item.line_total)
      subtotal += lineTotal

      doc
        .fontSize(10)
        .fillColor('#000000')
        .text(item.product_name, 55, currentY, { width: 180 })
        .text(item.variant_color, 250, currentY, { width: 80 })
        .text(item.size_value, 340, currentY)
        .text(item.quantity.toString(), 410, currentY)
        .text(`${lineTotal.toFixed(2)} €`, 480, currentY, { align: 'right', width: 60 })

      currentY += 25
    })

    // Ligne de séparation
    doc
      .moveTo(50, currentY + 10)
      .lineTo(550, currentY + 10)
      .strokeColor('#eeeeee')
      .lineWidth(1)
      .stroke()

    // Totaux
    const totalsY = currentY + 30
    const total = parseFloat(orderWithRelations.total_amount)
    const shipping = total - subtotal

    doc
      .fontSize(10)
      .fillColor('#000000')
      .text('Sous-total :', 380, totalsY, { align: 'right', width: 100 })
      .text(`${subtotal.toFixed(2)} €`, 480, totalsY, { align: 'right', width: 60 })

    doc
      .text('Livraison :', 380, totalsY + 20, { align: 'right', width: 100 })
      .text(`${shipping.toFixed(2)} €`, 480, totalsY + 20, { align: 'right', width: 60 })

    // Ligne pour le total
    doc
      .moveTo(380, totalsY + 45)
      .lineTo(550, totalsY + 45)
      .strokeColor('#333333')
      .lineWidth(2)
      .stroke()

    doc
      .fontSize(11)
      .fillColor('#000000')
      .text('TOTAL TTC :', 380, totalsY + 55, { align: 'right', width: 100 })
      .text(`${total.toFixed(2)} €`, 480, totalsY + 55, { align: 'right', width: 60 })

    // Footer
    doc
      .fontSize(9)
      .fillColor('#999999')
      .text(
        'Merci de votre commande ! Pour toute question, contactez-nous à contact@sneakers-shop.com',
        50,
        750,
        { align: 'center', width: 500 }
      )

    // Finaliser le PDF
    doc.end()

    // Attendre que le PDF soit généré
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    })

    console.log('✅ PDF généré')

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facture-${orderWithRelations.order_number}.pdf"`,
      },
    })

  } catch (error) {
    console.error('❌ Erreur génération facture:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
