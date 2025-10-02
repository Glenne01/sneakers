import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gender = searchParams.get('gender')

    console.log('API: Fetching products with gender:', gender)

    const products = await getProducts({
      gender: gender && gender !== 'all' ? gender : undefined
    })

    console.log('API: Found products:', products.length)

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: []
      },
      { status: 500 }
    )
  }
}
