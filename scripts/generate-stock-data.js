const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Tailles par genre
const SIZES_BY_GENDER = {
  homme: ['40', '41', '42', '43', '44', '45', '46'],
  femme: ['36', '37', '38', '39', '40', '41', '42'],
  enfant: ['28', '29', '30', '31', '32', '33', '34', '35']
}

async function generateStockData() {
  try {
    console.log('🚀 Début de la génération des données de stock...')

    // 1. Récupérer toutes les tailles disponibles
    const { data: allSizes, error: sizesError } = await supabase
      .from('sizes')
      .select('*')

    if (sizesError) {
      console.error('❌ Erreur lors de la récupération des tailles:', sizesError)
      return
    }

    console.log('📏 Tailles disponibles:', allSizes.length)

    // 2. Récupérer toutes les variantes de produits homme et femme
    const { data: variantsWithoutStock, error: variantsError } = await supabase
      .from('product_variants')
      .select(`
        id,
        product_id,
        sku,
        products!inner(
          id,
          name,
          gender
        )
      `)
      .in('products.gender', ['homme', 'femme'])

    if (variantsError) {
      console.error('❌ Erreur lors de la récupération des variantes:', variantsError)
      return
    }

    console.log('👟 Variantes sans stock:', variantsWithoutStock.length)

    // 3. Générer les données de stock
    const stockData = []

    for (const variant of variantsWithoutStock) {
      const gender = variant.products.gender
      const sizesForGender = SIZES_BY_GENDER[gender] || SIZES_BY_GENDER.homme

      console.log(`🔄 Traitement ${variant.products.name} (${gender})`)

      for (const sizeValue of sizesForGender) {
        // Trouver la taille correspondante
        const size = allSizes.find(s => s.size_value === sizeValue &&
          (s.gender === gender || s.gender === 'unisexe'))

        if (size) {
          // Générer une quantité aléatoire entre 5 et 15
          const quantity = Math.floor(Math.random() * 11) + 5

          stockData.push({
            variant_id: variant.id,
            size_id: size.id,
            quantity: quantity
          })
        }
      }
    }

    console.log(`📦 Génération de ${stockData.length} enregistrements de stock...`)

    // 4. Insérer les données par petits lots
    const batchSize = 100
    for (let i = 0; i < stockData.length; i += batchSize) {
      const batch = stockData.slice(i, i + batchSize)

      const { error: insertError } = await supabase
        .from('product_stock')
        .insert(batch)

      if (insertError) {
        console.error(`❌ Erreur lors de l'insertion du lot ${i/batchSize + 1}:`, insertError)
      } else {
        console.log(`✅ Lot ${i/batchSize + 1}/${Math.ceil(stockData.length/batchSize)} inséré`)
      }
    }

    console.log('🎉 Génération du stock terminée !')

    // 5. Vérification finale
    const { data: finalCount } = await supabase
      .from('product_stock')
      .select('id', { count: 'exact' })

    console.log(`📊 Total d'enregistrements de stock: ${finalCount?.length || 'N/A'}`)

  } catch (error) {
    console.error('💥 Erreur générale:', error)
  }
}

generateStockData()