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

// Ajuster le stock manuellement
export async function PATCH(request: NextRequest) {
  try {
    const { variant_id, size_id, new_quantity, reason, user_id } = await request.json()

    if (!variant_id || !size_id || new_quantity === undefined) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.rpc('adjust_stock', {
      p_variant_id: variant_id,
      p_size_id: size_id,
      p_new_quantity: new_quantity,
      p_reason: reason || 'Ajustement manuel',
      p_user_id: user_id
    })

    if (error) throw error

    if (!data.success) {
      return NextResponse.json(
        { error: data.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Erreur ajustement stock:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}