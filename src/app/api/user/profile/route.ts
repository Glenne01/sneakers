import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API /api/user/profile appelée')

    // Récupérer l'authUserId depuis les query params
    const searchParams = request.nextUrl.searchParams
    const authUserId = searchParams.get('authUserId')

    if (!authUserId) {
      return NextResponse.json(
        { success: false, error: 'authUserId requis' },
        { status: 400 }
      )
    }

    // Créer le client Supabase
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnkomglhvrwaddshwjff.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBua29tZ2xodnJ3YWRkc2h3amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTMwMDEsImV4cCI6MjA3NDM2OTAwMX0.IakWiHM3bIjAm03DDv9GvF7PIGgpmMoU2JveB0DMbr4'
    )

    console.log('🔍 Chargement du profil pour authUserId:', authUserId)

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single()

    if (userError) {
      console.error('❌ Erreur Supabase:', userError)
      return NextResponse.json(
        { success: false, error: userError.message },
        { status: 404 }
      )
    }

    console.log('✅ Profil chargé')

    return NextResponse.json({
      success: true,
      data: userData
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
