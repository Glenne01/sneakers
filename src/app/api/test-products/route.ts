import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gender = searchParams.get('gender') || undefined

  try {
    const products = await getProducts({ gender })

    // Compter les produits par genre
    const stats = {
      total: products.length,
      homme: products.filter(p => p.gender === 'homme').length,
      femme: products.filter(p => p.gender === 'femme').length,
      enfant: products.filter(p => p.gender === 'enfant').length,
      unisexe: products.filter(p => p.gender === 'unisexe').length,
    }

    return NextResponse.json({
      success: true,
      gender_filter: gender || 'all',
      stats,
      sample_products: products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        gender: p.gender,
        brand: p.brand?.name,
        price: p.base_price,
        image: p.variants?.[0]?.image_url
      }))
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}