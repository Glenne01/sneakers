import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API /api/orders appelée')

    // Récupérer le userId depuis les query params
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId requis' },
        { status: 400 }
      )
    }

    // Créer le client Supabase
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnkomglhvrwaddshwjff.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBua29tZ2xodnJ3YWRkc2h3amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTMwMDEsImV4cCI6MjA3NDM2OTAwMX0.IakWiHM3bIjAm03DDv9GvF7PIGgpmMoU2JveB0DMbr4'
    )

    console.log('🔍 Chargement des commandes pour userId:', userId)

    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product_variants (
            *,
            products (name)
          ),
          sizes (size_value, size_display)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('❌ Erreur Supabase:', ordersError)
      return NextResponse.json(
        { success: false, error: ordersError.message },
        { status: 500 }
      )
    }

    console.log('✅ Commandes chargées:', ordersData?.length || 0)

    return NextResponse.json({
      success: true,
      data: ordersData || []
    })

  } catch (error) {
    console.error('❌ Erreur API:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
