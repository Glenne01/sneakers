import { NextRequest, NextResponse } from 'next/server'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = (await params).id
    const supabase = createClientComponentClient<Database>()

    // Première étape : récupérer toutes les variantes du produit
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)

    if (variantsError) {
      console.error('Erreur lors de la récupération des variantes:', variantsError)
      return NextResponse.json({ error: 'Erreur lors de la récupération des variantes' }, { status: 500 })
    }

    if (!variants || variants.length === 0) {
      return NextResponse.json([])
    }

    const variantIds = variants.map(v => v.id)

    // Deuxième étape : récupérer le stock pour ces variantes
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
      console.error('Erreur lors de la récupération du stock:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération du stock' }, { status: 500 })
    }

    // Transformer les données pour l'interface
    const formattedSizes = stockData?.map(item => ({
      id: item.sizes?.id || '',
      size_value: item.sizes?.size_value || '',
      size_display: item.sizes?.size_display || '',
      stock: item.quantity || 0
    })) || []

    // Grouper par taille et additionner le stock si plusieurs variantes
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

    return NextResponse.json(uniqueSizes)

  } catch (error) {
    console.error('Erreur dans l\'API product-stock:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du stock' },
      { status: 500 }
    )
  }
}