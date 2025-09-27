import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Récupérer l'historique des mouvements de stock
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const variantId = searchParams.get('variant_id')
    const sizeId = searchParams.get('size_id')
    const movementType = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('stock_movements')
      .select(`
        *,
        product_variants!inner(
          sku,
          color,
          products!inner(
            name,
            brands(name)
          )
        ),
        sizes!inner(size_display),
        users(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (variantId) {
      query = query.eq('variant_id', variantId)
    }
    if (sizeId) {
      query = query.eq('size_id', sizeId)
    }
    if (movementType) {
      query = query.eq('movement_type', movementType)
    }

    const { data: movements, error } = await query

    if (error) throw error

    // Compter le total pour la pagination
    let countQuery = supabase
      .from('stock_movements')
      .select('*', { count: 'exact', head: true })

    if (variantId) countQuery = countQuery.eq('variant_id', variantId)
    if (sizeId) countQuery = countQuery.eq('size_id', sizeId)
    if (movementType) countQuery = countQuery.eq('movement_type', movementType)

    const { count, error: countError } = await countQuery

    if (countError) throw countError

    return NextResponse.json({
      movements,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    })
  } catch (error) {
    console.error('Erreur récupération mouvements:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Créer un mouvement de stock manuel
export async function POST(request: NextRequest) {
  try {
    const {
      variant_id,
      size_id,
      movement_type,
      quantity_change,
      reason,
      reference_type,
      reference_id,
      created_by
    } = await request.json()

    if (!variant_id || !size_id || !movement_type || !quantity_change) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    // Récupérer la quantité actuelle
    const { data: currentStock, error: stockError } = await supabase
      .from('product_stock')
      .select('quantity')
      .eq('variant_id', variant_id)
      .eq('size_id', size_id)
      .single()

    if (stockError) throw stockError

    const quantityBefore = currentStock.quantity
    const quantityAfter = quantityBefore + quantity_change

    // Insérer le mouvement
    const { data, error } = await supabase
      .from('stock_movements')
      .insert({
        variant_id,
        size_id,
        movement_type,
        quantity_change,
        quantity_before: quantityBefore,
        quantity_after: quantityAfter,
        reason,
        reference_type,
        reference_id,
        created_by
      })
      .select()

    if (error) throw error

    // Mettre à jour le stock si nécessaire
    if (movement_type !== 'reservation' && movement_type !== 'release') {
      const { error: updateError } = await supabase
        .from('product_stock')
        .update({
          quantity: quantityAfter,
          updated_by: created_by,
          updated_at: new Date().toISOString()
        })
        .eq('variant_id', variant_id)
        .eq('size_id', size_id)

      if (updateError) throw updateError
    }

    return NextResponse.json({ success: true, movement: data[0] })
  } catch (error) {
    console.error('Erreur création mouvement:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}