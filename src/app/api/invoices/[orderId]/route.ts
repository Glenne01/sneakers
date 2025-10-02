import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { renderToBuffer } from '@react-pdf/renderer'
import { InvoiceTemplate } from '@/lib/pdf/InvoiceTemplate'
import { createElement } from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = (await params).orderId
    console.log('🔍 Génération facture pour commande:', orderId)

    // Créer le client Supabase
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnkomglhvrwaddshwjff.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBua29tZ2xodnJ3YWRkc2h3amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTMwMDEsImV4cCI6MjA3NDM2OTAwMX0.IakWiHM3bIjAm03DDv9GvF7PIGgpmMoU2JveB0DMbr4'
    )

    // Récupérer la commande avec tous les détails
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        users (first_name, last_name, email),
        order_items (*)
      `)
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

    // Calculer les totaux
    const items = order.order_items.map((item: any) => ({
      productName: item.product_name,
      variantColor: item.variant_color,
      sizeValue: item.size_value,
      quantity: item.quantity,
      unitPrice: parseFloat(item.unit_price),
      lineTotal: parseFloat(item.line_total),
    }))

    const subtotal = items.reduce((sum: number, item: any) => sum + item.lineTotal, 0)
    const total = parseFloat(order.total_amount)
    const shipping = total - subtotal

    // Préparer les données de la facture
    const invoiceData = {
      orderNumber: order.order_number,
      orderDate: new Date(order.created_at).toLocaleDateString('fr-FR'),
      customer: {
        name: `${order.users?.first_name || ''} ${order.users?.last_name || ''}`.trim(),
        email: order.users?.email || '',
        address: order.shipping_address || '',
      },
      items,
      subtotal,
      shipping,
      total,
    }

    console.log('📄 Génération du PDF...')

    // Générer le PDF
    const pdfBuffer = await renderToBuffer(
      createElement(InvoiceTemplate, { data: invoiceData })
    )

    console.log('✅ PDF généré')

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facture-${order.order_number}.pdf"`,
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
