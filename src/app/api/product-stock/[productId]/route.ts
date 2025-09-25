import { NextRequest, NextResponse } from 'next/server'
import { supabase, handleSupabaseResponse } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params

    // D'abord récupérer le variant_id du produit
    const variantResponse = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .eq('is_active', true)
      .single()

    const variantData = handleSupabaseResponse(variantResponse)
    
    if (!variantData) {
      return NextResponse.json([])
    }

    const response = await supabase
      .from('product_stock')
      .select(`
        quantity,
        size:sizes(id, size_value)
      `)
      .eq('variant_id', variantData.id)
      .gt('quantity', 0)
      .order('size_value', { foreignTable: 'sizes' })

    const stockData = handleSupabaseResponse(response)
    
    if (!stockData) {
      return NextResponse.json([])
    }

    // Transformer les données pour l'interface
    const formattedStock = stockData.map((item: any) => ({
      id: item.size.id,
      size_value: item.size.size_value,
      stock: item.quantity
    }))

    return NextResponse.json(formattedStock)
  } catch (error) {
    console.error('Erreur lors de la récupération du stock:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}