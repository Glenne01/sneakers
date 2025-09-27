import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test 1: Vérifier les variables d'environnement
    const config = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      actualUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
    }

    // Test 2: Compter les produits
    const { data: products, error: productsError, count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Test 3: Récupérer un produit
    const { data: sampleProduct, error: sampleError } = await supabase
      .from('products')
      .select('id, name, is_active')
      .eq('is_active', true)
      .limit(1)
      .single()

    // Test 4: Tester la connexion
    const { data: testConnection, error: connectionError } = await supabase
      .from('products')
      .select('count')

    return NextResponse.json({
      success: true,
      environment: config,
      database: {
        productsCount: count || 0,
        productsError: productsError?.message || null,
        sampleProduct: sampleProduct || null,
        sampleError: sampleError?.message || null,
        connectionTest: testConnection ? 'OK' : 'FAILED',
        connectionError: connectionError?.message || null
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}