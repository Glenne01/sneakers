import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Récupérer les alertes de stock
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'active'
    const alertType = searchParams.get('type')

    let query = supabase
      .from('stock_alerts')
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
        sizes!inner(size_display)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (alertType) {
      query = query.eq('alert_type', alertType)
    }

    const { data: alerts, error } = await query

    if (error) throw error

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Erreur récupération alertes:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Marquer une alerte comme résolue
export async function PATCH(request: NextRequest) {
  try {
    const { alert_id, user_id } = await request.json()

    if (!alert_id) {
      return NextResponse.json(
        { error: 'alert_id requis' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('stock_alerts')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: user_id
      })
      .eq('id', alert_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur résolution alerte:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Ignorer une alerte
export async function DELETE(request: NextRequest) {
  try {
    const { alert_id, user_id } = await request.json()

    if (!alert_id) {
      return NextResponse.json(
        { error: 'alert_id requis' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('stock_alerts')
      .update({
        status: 'ignored',
        resolved_at: new Date().toISOString(),
        resolved_by: user_id
      })
      .eq('id', alert_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression alerte:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}