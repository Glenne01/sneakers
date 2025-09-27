import { supabase } from './supabase'
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

export async function getProducts(filters?: { gender?: string }): Promise<ProductWithVariants[]> {
  try {
    console.log('🔄 Début du chargement des produits depuis Supabase...')
    console.log('Filtres appliqués:', filters)

    let query = supabase
      .from('products')
      .select(`
        *,
        product_variants(*),
        brands(*),
        categories(*)
      `)
      .eq('is_active', true)

    // Appliquer le filtre par genre si spécifié
    if (filters?.gender && filters.gender !== 'all') {
      query = query.eq('gender', filters.gender)
    }

    const response = await query.order('created_at', { ascending: false })

    console.log('📡 Réponse Supabase reçue:', response)

    if (response.error) {
      console.error('❌ Erreur Supabase:', response.error)
      return []
    }

    const products = response.data || []
    console.log('✅ Produits récupérés depuis Supabase:', products.length, 'produits')

    // Transformer les produits pour correspondre à l'interface ProductWithVariants
    const transformedProducts = products.map(product => ({
      ...product,
      variants: product.product_variants || [],
      brand: product.brands,
      category: product.categories
    }))

    // Filtrer les produits qui ont au moins une variante active
    const filteredProducts = transformedProducts.filter(product =>
      product.variants && product.variants.length > 0 &&
      product.variants.some((variant: ProductVariant) => variant.is_active)
    )

    console.log('🎯 Produits filtrés et prêts:', filteredProducts.length, 'produits')
    console.log('📝 Premier produit exemple:', filteredProducts[0])

    return filteredProducts

  } catch (error) {
    console.error('💥 Erreur lors de la récupération des produits:', error)
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

    if (response.error) {
      console.error('❌ Erreur Supabase:', response.error)
      return []
    }

    const products = response.data || []

    // Transformer les produits pour correspondre à l'interface ProductWithVariants
    const transformedProducts = products.map(product => ({
      ...product,
      variants: product.product_variants || [],
      brand: product.brands,
      category: product.categories
    }))

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
    // Decode URL first
    const decodedSlug = decodeURIComponent(slug)
    console.log('🔍 Recherche produit par slug:', slug, '-> décodé:', decodedSlug)

    // Extract SKU from slug (format: product-name-SKU)
    // Get all possible SKUs from database to match against
    const allSkusResponse = await supabase
      .from('product_variants')
      .select('sku')
      .eq('is_active', true)

    if (allSkusResponse.error) {
      console.error('❌ Erreur lors de la récupération des SKUs:', allSkusResponse.error)
      return null
    }

    const allSkus = allSkusResponse.data?.map(item => item.sku) || []

    // Try to find the SKU that matches the end of the slug
    let sku = ''

    // Check each possible SKU to see if the slug ends with it (case insensitive)
    for (const possibleSku of allSkus) {
      const slugLower = decodedSlug.toLowerCase()
      const skuLower = possibleSku.toLowerCase()

      // Check if slug ends with this SKU (with a dash before it)
      if (slugLower.endsWith('-' + skuLower) || slugLower.endsWith(skuLower)) {
        sku = possibleSku
        break
      }
    }

    console.log('🔍 Debug slug:', {
      slug,
      decodedSlug,
      extractedSku: sku,
      totalSkusAvailable: allSkus.length,
      sampleSkus: allSkus.slice(0, 10)
    })

    if (!sku) {
      console.log('❌ Aucun SKU trouvé pour le slug:', slug)
      return null
    }

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

    if (response.error) {
      console.error('❌ Erreur lors de la récupération du produit:', response.error)
      return null
    }

    const variants = response.data || []
    if (!variants || variants.length === 0 || !variants[0]?.product) {
      console.log('❌ Aucun produit trouvé pour le SKU:', sku)
      return null
    }

    const variant = variants[0]
    console.log('✅ Produit trouvé:', variant.product.name)

    // Get all variants for this product
    const variantsResponse = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', variant.product.id)
      .eq('is_active', true)

    if (variantsResponse.error) {
      console.error('❌ Erreur lors de la récupération des variantes:', variantsResponse.error)
      return null
    }

    const allVariants = variantsResponse.data || []

    return {
      ...variant.product,
      variants: allVariants
    } as ProductWithVariants

  } catch (error) {
    console.error('💥 Erreur lors de la récupération du produit:', error)
    return null
  }
}