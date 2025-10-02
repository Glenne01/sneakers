import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/products'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = (await params).slug
    console.log('API: Fetching product by slug:', slug)

    const product = await getProductBySlug(slug)

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          data: null
        },
        { status: 404 }
      )
    }

    console.log('API: Product found:', product.name)

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      },
      { status: 500 }
    )
  }
}
