import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const variantId = searchParams.get('variant_id')
    const sizeId = searchParams.get('size_id')
    const alertsOnly = searchParams.get('alerts_only') === 'true'

    if (alertsOnly) {
      // Récupérer seulement les alertes actives
      const { data: alerts, error } = await supabase
        .from('stock_alerts')
        .select(`
          *,
          product_variants!inner(
            sku,
            color,
            products!inner(name, brands(name))
          ),
          sizes!inner(size_display)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      return NextResponse.json({ alerts })
    }

    // Construire la requête selon les paramètres
    let query = supabase
      .from('stock_overview')
      .select('*')
      .order('last_movement_date', { ascending: false })

    if (variantId) {
      query = query.eq('variant_id', variantId)
    }
    if (sizeId) {
      query = query.eq('size_id', sizeId)
    }

    const { data: stockData, error } = await query

    if (error) throw error

    return NextResponse.json({ stock: stockData })
  } catch (error) {
    console.error('Erreur récupération stock:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Ajuster le stock manuellement
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { variant_id, size_id, new_quantity, reason, user_id } = body

    console.log('📦 Stock adjustment request:', { variant_id, size_id, new_quantity, reason })

    if (!variant_id || !size_id || new_quantity === undefined) {
      console.error('❌ Paramètres manquants:', { variant_id, size_id, new_quantity })
      return NextResponse.json(
        { error: 'Paramètres manquants: variant_id, size_id et new_quantity requis' },
        { status: 400 }
      )
    }

    // Récupérer le stock actuel
    const { data: currentStock, error: fetchError } = await supabase
      .from('product_stock')
      .select('id, quantity')
      .eq('variant_id', variant_id)
      .eq('size_id', size_id)
      .single() as { data: any, error: any }

    if (fetchError) {
      console.error('❌ Erreur récupération stock:', fetchError)
      return NextResponse.json(
        { error: `Stock introuvable: ${fetchError.message}` },
        { status: 404 }
      )
    }

    if (!currentStock) {
      console.error('❌ Aucun stock trouvé pour variant_id:', variant_id, 'size_id:', size_id)
      return NextResponse.json(
        { error: 'Aucun enregistrement de stock trouvé pour cette variante et taille' },
        { status: 404 }
      )
    }

    console.log('✅ Stock actuel récupéré:', currentStock)

    const quantityBefore = currentStock.quantity
    const quantityChange = new_quantity - quantityBefore

    console.log('🔄 Mise à jour du stock:', { quantityBefore, new_quantity, quantityChange })

    // Mettre à jour le stock
    const updateResult = await supabase
      .from('product_stock')
      .update({
        quantity: new_quantity,
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', currentStock.id)

    const { error: updateError } = updateResult as any

    if (updateError) {
      console.error('❌ Erreur mise à jour stock:', updateError)
      return NextResponse.json(
        { error: `Erreur mise à jour: ${updateError.message}` },
        { status: 500 }
      )
    }

    console.log('✅ Stock mis à jour avec succès')

    // Enregistrer le mouvement de stock
    const movementResult = await supabase
      .from('stock_movements')
      .insert({
        variant_id,
        size_id,
        movement_type: 'adjustment',
        quantity_change: quantityChange,
        quantity_before: quantityBefore,
        quantity_after: new_quantity,
        reason: reason || 'Ajustement manuel',
        user_id: user_id || null
      } as any)

    const { error: movementError } = movementResult as any

    if (movementError) {
      console.error('⚠️ Erreur enregistrement mouvement (non-bloquant):', movementError)
      // Ne pas bloquer si l'enregistrement du mouvement échoue
    } else {
      console.log('✅ Mouvement de stock enregistré')
    }

    return NextResponse.json({
      success: true,
      message: 'Stock ajusté avec succès',
      data: {
        variant_id,
        size_id,
        quantity_before: quantityBefore,
        quantity_after: new_quantity,
        quantity_change: quantityChange
      }
    })
  } catch (error) {
    console.error('Erreur ajustement stock:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}