import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Confirmer une réservation (déduire le stock physique)
export async function POST(request: NextRequest) {
  try {
    const { reservation_id } = await request.json()

    if (!reservation_id) {
      return NextResponse.json(
        { error: 'reservation_id requis' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.rpc('fulfill_reservation', {
      p_reservation_id: reservation_id
    })

    if (error) throw error

    if (!data.success) {
      return NextResponse.json(
        { error: data.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      new_stock: data.new_stock
    })
  } catch (error) {
    console.error('Erreur confirmation réservation:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}