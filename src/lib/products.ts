import { supabase, handleSupabaseResponse } from './supabase'
import { Product, ProductVariant } from '@/types/database'

export interface ProductWithVariants extends Product {
  variants: ProductVariant[]
  brand?: {
    id: string
    name: string
    logo_url: string | null
    description: string | null
    is_active: boolean
    created_at: string
  }
  category?: {
    id: string
    name: string
    gender: 'homme' | 'femme' | 'enfant' | 'unisexe'
    description: string | null
    is_active: boolean
    created_at: string
  }
}

export async function getProducts(): Promise<ProductWithVariants[]> {
  try {
    const response = await supabase
      .from('products')
      .select(`
        *,
        product_variants(*),
        brands(*),
        categories(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    const products = handleSupabaseResponse(response)

    // Debug: afficher les produits récupérés
    console.log('Produits récupérés depuis Supabase:', products?.length, 'produits')
    console.log('Détail des produits:', products)

    // Transformer les produits pour correspondre à l'interface ProductWithVariants
    const transformedProducts = products?.map(product => ({
      ...product,
      variants: product.product_variants || [],
      brand: product.brands,
      category: product.categories
    })) || []

    // Filtrer les produits qui ont au moins une variante active
    const filteredProducts = transformedProducts.filter(product =>
      product.variants && product.variants.length > 0 &&
      product.variants.some((variant: ProductVariant) => variant.is_active)
    )

    console.log('Produits filtrés:', filteredProducts.length, 'produits')
    console.log('Détail des produits filtrés:', filteredProducts)

    return filteredProducts

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }
}

export async function getProductsByCategory(categoryId: string): Promise<ProductWithVariants[]> {
  try {
    const response = await supabase
      .from('products')
      .select(`
        *,
        product_variants(*),
        brands(*),
        categories(*)
      `)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    const products = handleSupabaseResponse(response)

    // Transformer les produits pour correspondre à l'interface ProductWithVariants
    const transformedProducts = products?.map(product => ({
      ...product,
      variants: product.product_variants || [],
      brand: product.brands,
      category: product.categories
    })) || []

    return transformedProducts.filter(product =>
      product.variants && product.variants.length > 0 &&
      product.variants.some((variant: ProductVariant) => variant.is_active)
    )

  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie:', error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  try {
    // Extract SKU from slug (format: product-name-SKU)
    // Get all possible SKUs from database to match against
    const allSkusResponse = await supabase
      .from('product_variants')
      .select('sku')
      .eq('is_active', true)

    const allSkus = handleSupabaseResponse(allSkusResponse)?.map(item => item.sku) || []

    // Try to find the SKU that matches the end of the slug
    let sku = ''

    // Check each possible SKU to see if the slug ends with it (case insensitive)
    for (const possibleSku of allSkus) {
      const slugLower = slug.toLowerCase()
      const skuLower = possibleSku.toLowerCase()

      // Check if slug ends with this SKU (with a dash before it)
      if (slugLower.endsWith('-' + skuLower) || slugLower.endsWith(skuLower)) {
        sku = possibleSku
        break
      }
    }

    console.log('Debug: slug =', slug, ', extracted SKU =', sku, ', available SKUs =', allSkus.slice(0, 5))

    const response = await supabase
      .from('product_variants')
      .select(`
        *,
        product:products(
          *,
          brand:brands(*),
          category:categories(*)
        )
      `)
      .eq('sku', sku)
      .eq('is_active', true)
      .limit(1)

    const variants = handleSupabaseResponse(response)
    
    if (!variants || variants.length === 0 || !variants[0]?.product) return null

    const variant = variants[0]
    
    // Get all variants for this product
    const variantsResponse = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', variant.product.id)
      .eq('is_active', true)

    const allVariants = handleSupabaseResponse(variantsResponse) || []

    return {
      ...variant.product,
      variants: allVariants
    } as ProductWithVariants
    
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return null
  }
}