import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = (await params).id

    // Utiliser les credentials directement (temporaire pour test)
    const supabase = createClient<Database>(
      'https://pnkomglhvrwaddshwjff.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBua29tZ2xodnJ3YWRkc2h3amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTMwMDEsImV4cCI6MjA3NDM2OTAwMX0.IakWiHM3bIjAm03DDv9GvF7PIGgpmMoU2JveB0DMbr4'
    )

    // Récupérer les variantes du produit
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)

    if (variantsError) {
      return NextResponse.json({ error: 'Erreur variantes', details: variantsError }, { status: 500 })
    }

    if (!variants || variants.length === 0) {
      return NextResponse.json([])
    }

    const variantIds = variants.map(v => v.id)

    // Récupérer le stock
    const { data: stockData, error } = await supabase
      .from('product_stock')
      .select(`
        id,
        quantity,
        size_id,
        sizes (
          id,
          size_value,
          size_display,
          gender,
          sort_order
        )
      `)
      .in('variant_id', variantIds)
      .order('sizes(sort_order)')

    if (error) {
      return NextResponse.json({ error: 'Erreur stock', details: error }, { status: 500 })
    }

    // Transformer les données
    const formattedSizes = stockData?.map(item => ({
      id: item.sizes?.id || '',
      size_value: item.sizes?.size_value || '',
      size_display: item.sizes?.size_display || '',
      stock: item.quantity || 0
    })) || []

    const sizeMap = new Map()
    formattedSizes.forEach(size => {
      if (sizeMap.has(size.id)) {
        sizeMap.get(size.id).stock += size.stock
      } else {
        sizeMap.set(size.id, size)
      }
    })

    const uniqueSizes = Array.from(sizeMap.values()).sort((a, b) =>
      parseInt(a.size_value) - parseInt(b.size_value)
    )

    return NextResponse.json({
      success: true,
      sizes: uniqueSizes,
      debug: { variantsCount: variants.length, stockCount: stockData?.length }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    )
  }
}