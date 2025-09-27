import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = (await params).id
    console.log('🔍 API product-stock appelée pour ID:', productId)

    // Vérifier les variables d'environnement
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Variables Supabase manquantes')
      return NextResponse.json({ error: 'Configuration Supabase manquante' }, { status: 500 })
    }

    // Utiliser le client serveur pour Vercel
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    console.log('✅ Client Supabase créé')

    // Première étape : récupérer toutes les variantes du produit
    console.log('🔄 Récupération des variantes pour produit:', productId)
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)

    if (variantsError) {
      console.error('❌ Erreur lors de la récupération des variantes:', variantsError)
      return NextResponse.json({ error: 'Erreur lors de la récupération des variantes' }, { status: 500 })
    }

    console.log('✅ Variantes trouvées:', variants?.length || 0)
    if (!variants || variants.length === 0) {
      console.log('⚠️ Aucune variante trouvée pour ce produit')
      return NextResponse.json([])
    }

    const variantIds = variants.map(v => v.id)
    console.log('🔄 Récupération du stock pour les variantes:', variantIds)

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
      console.error('❌ Erreur lors de la récupération du stock:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération du stock' }, { status: 500 })
    }

    console.log('✅ Stock récupéré:', stockData?.length || 0, 'enregistrements')

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

    console.log('🎯 Tailles finales envoyées:', uniqueSizes.length)
    return NextResponse.json(uniqueSizes)

  } catch (error) {
    console.error('Erreur dans l\'API product-stock:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du stock' },
      { status: 500 }
    )
  }
}