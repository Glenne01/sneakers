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
        variants:product_variants(*),
        brand:brands(*),
        category:categories(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    const products = handleSupabaseResponse(response)
    
    // Debug: afficher les produits récupérés
    console.log('Produits récupérés depuis Supabase:', products?.length, 'produits')
    console.log('Détail des produits:', products)
    
    // Filtrer les produits qui ont au moins une variante active
    const filteredProducts = products?.filter(product => 
      product.variants && product.variants.length > 0 && 
      product.variants.some((variant: ProductVariant) => variant.is_active)
    ) || []
    
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
        variants:product_variants(*),
        brand:brands(*),
        category:categories(*)
      `)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    const products = handleSupabaseResponse(response)
    
    return products?.filter(product => 
      product.variants && product.variants.length > 0 && 
      product.variants.some((variant: ProductVariant) => variant.is_active)
    ) || []
    
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie:', error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  try {
    // Extract SKU from slug (assuming format: product-name-FULL-SKU)
    // Find the last occurrence of a known SKU pattern
    const parts = slug.split('-')
    
    // Try to find a matching SKU pattern (looking for the last few parts that might form a SKU)
    let sku = ''
    
    // Check if the last parts contain a known SKU pattern
    for (let i = parts.length - 3; i < parts.length; i++) {
      if (i >= 0) {
        const potentialSku = parts.slice(i).join('-').toUpperCase()
        // Check if this looks like our SKU format
        if (potentialSku.includes('-001') || potentialSku.match(/^[A-Z]+-[A-Z]+-\d+$/)) {
          sku = potentialSku
          break
        }
      }
    }
    
    // Fallback: try the last part uppercased if no pattern found
    if (!sku) {
      sku = parts[parts.length - 1].toUpperCase()
    }
    
    console.log('Debug: slug =', slug, ', extracted SKU =', sku)

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