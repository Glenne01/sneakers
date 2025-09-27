import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Réserver du stock temporairement
export async function POST(request: NextRequest) {
  try {
    const {
      variant_id,
      size_id,
      quantity,
      reservation_type = 'cart',
      reference_id,
      user_id,
      expires_minutes = 15
    } = await request.json()

    if (!variant_id || !size_id || !quantity) {
      return NextResponse.json(
        { error: 'Paramètres manquants (variant_id, size_id, quantity requis)' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.rpc('reserve_stock', {
      p_variant_id: variant_id,
      p_size_id: size_id,
      p_quantity: quantity,
      p_reservation_type: reservation_type,
      p_reference_id: reference_id,
      p_user_id: user_id,
      p_expires_minutes: expires_minutes
    })

    if (error) throw error

    if (!data.success) {
      return NextResponse.json(
        { error: data.error, available: data.available, requested: data.requested },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      reservation_id: data.reservation_id,
      expires_at: data.expires_at
    })
  } catch (error) {
    console.error('Erreur réservation stock:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Libérer une réservation
export async function DELETE(request: NextRequest) {
  try {
    const { reservation_id } = await request.json()

    if (!reservation_id) {
      return NextResponse.json(
        { error: 'reservation_id requis' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.rpc('release_reservation', {
      p_reservation_id: reservation_id
    })

    if (error) throw error

    if (!data.success) {
      return NextResponse.json(
        { error: data.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur libération réservation:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}