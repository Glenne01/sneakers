import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { variantId, sizeId, quantity } = await request.json()

    if (!variantId || !sizeId || !quantity) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    console.log(`📦 Décrémentation du stock: variant=${variantId}, size=${sizeId}, qty=${quantity}`)

    // Récupérer le stock actuel
    const { data: stockData, error: stockFetchError } = await supabase
      .from('product_stock')
      .select('id, quantity')
      .eq('variant_id', variantId)
      .eq('size_id', sizeId)
      .single()

    if (stockFetchError || !stockData) {
      console.error('❌ Erreur récupération stock:', stockFetchError)
      return NextResponse.json(
        { error: 'Stock non trouvé' },
        { status: 404 }
      )
    }

    // Calculer la nouvelle quantité
    const newQuantity = Math.max(0, stockData.quantity - quantity)

    console.log(`📊 Stock actuel: ${stockData.quantity}, Nouveau stock: ${newQuantity}`)

    // Mettre à jour le stock
    const { error: stockUpdateError } = await supabase
      .from('product_stock')
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', stockData.id)

    if (stockUpdateError) {
      console.error('❌ Erreur mise à jour stock:', stockUpdateError)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du stock' },
        { status: 500 }
      )
    }

    console.log(`✅ Stock décrémenté avec succès pour variant ${variantId}`)

    return NextResponse.json({
      success: true,
      oldQuantity: stockData.quantity,
      newQuantity: newQuantity
    })

  } catch (error: any) {
    console.error('❌ Erreur dans /api/stock/decrement:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
