require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const scraper = require('./sneaker-scraper');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('Vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour importer une marque
async function createOrGetBrand(brandName) {
  if (!brandName || brandName === 'Unknown') {
    brandName = 'Autre';
  }

  // Vérifier si la marque existe
  const { data: existingBrand, error: brandError } = await supabase
    .from('brands')
    .select('id')
    .eq('name', brandName)
    .single();

  if (existingBrand) {
    return existingBrand.id;
  }

  // Créer la marque si elle n'existe pas
  const { data: newBrand, error: createError } = await supabase
    .from('brands')
    .insert({
      name: brandName,
      description: `Marque ${brandName}`,
      is_active: true
    })
    .select('id')
    .single();

  if (createError) {
    console.error(`❌ Erreur création marque ${brandName}:`, createError);
    return null;
  }

  console.log(`✅ Marque créée: ${brandName}`);
  return newBrand.id;
}

// Fonction pour importer un produit
async function importProduct(sneakerData) {
  try {
    const {
      name,
      brand_name,
      silhouette,
      color,
      retail_price_cents,
      gender,
      main_picture_url,
      grid_picture_url,
      sku,
      release_date,
      details,
      category,
      single_gender,
      size,
      allowed_sizes
    } = sneakerData;

    // 1. Créer ou récupérer la marque
    const brandId = await createOrGetBrand(brand_name);
    if (!brandId) return null;

    // 2. Créer le produit principal
    const productName = name || silhouette || 'Sneaker';
    const description = details || `${brand_name} ${silhouette || 'sneaker'} ${color ? `coloris ${color}` : ''}`;
    const basePrice = retail_price_cents ? (retail_price_cents / 100) : 50; // Prix par défaut si manquant

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: productName,
        description: description,
        base_price: basePrice,
        gender: mapGender(gender, single_gender, category),
        brand_id: brandId,
        is_active: true
      })
      .select('id')
      .single();

    if (productError) {
      console.error(`❌ Erreur création produit ${productName}:`, productError);
      return null;
    }

    // 3. Vérifier si le SKU existe déjà
    const variantSKU = sku || `${brand_name?.slice(0,3).toUpperCase()}-${Date.now()}`;

    const { data: existingVariant } = await supabase
      .from('product_variants')
      .select('id')
      .eq('sku', variantSKU)
      .single();

    if (existingVariant) {
      console.log(`⚠️ SKU ${variantSKU} existe déjà, produit ignoré`);
      return null;
    }

    // 4. Créer la variante
    const variantPrice = basePrice || 50;
    const imageUrl = main_picture_url || grid_picture_url;

    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .insert({
        product_id: product.id,
        sku: variantSKU,
        color: color || 'Standard',
        price: variantPrice,
        image_url: imageUrl,
        is_active: true
      })
      .select('id')
      .single();

    if (variantError) {
      console.error(`❌ Erreur création variante ${variantSKU}:`, variantError);
      return null;
    }

    // 5. Créer le stock pour différentes tailles
    const sizes = await getSizesForGender(mapGender(gender, single_gender, category));
    for (const size of sizes) {
      await supabase
        .from('product_stock')
        .insert({
          variant_id: variant.id,
          size_id: size.id,
          quantity: Math.floor(Math.random() * 20) + 5, // Stock aléatoire entre 5 et 25
          updated_at: new Date().toISOString()
        });
    }

    console.log(`✅ Produit importé: ${productName} (${variantSKU})`);
    return {
      product_id: product.id,
      variant_id: variant.id,
      name: productName,
      sku: variantSKU
    };

  } catch (error) {
    console.error('❌ Erreur import produit:', error);
    return null;
  }
}

// Fonction pour mapper le genre
function mapGender(apiGender, singleGender, category) {
  // Priorité à la catégorie détectée par notre script
  if (category && category !== 'unclassified') {
    return category;
  }

  // Utiliser single_gender en priorité (plus précis)
  if (singleGender) {
    const gender = singleGender.toLowerCase();
    if (gender.includes('men') || gender.includes('male')) return 'homme';
    if (gender.includes('women') || gender.includes('female') || gender.includes('girls')) return 'femme';
    if (gender.includes('kids') || gender.includes('youth') || gender.includes('child')) return 'enfant';
  }

  // Mapper le genre de l'API (array)
  if (Array.isArray(apiGender)) {
    for (const genderItem of apiGender) {
      const gender = genderItem.toLowerCase();
      if (gender.includes('men') || gender.includes('male')) return 'homme';
      if (gender.includes('women') || gender.includes('female') || gender.includes('girls')) return 'femme';
      if (gender.includes('kids') || gender.includes('youth') || gender.includes('child')) return 'enfant';
    }
  } else if (typeof apiGender === 'string') {
    const gender = apiGender.toLowerCase();
    if (gender.includes('men') || gender.includes('male')) return 'homme';
    if (gender.includes('women') || gender.includes('female') || gender.includes('girls')) return 'femme';
    if (gender.includes('kids') || gender.includes('youth') || gender.includes('child')) return 'enfant';
  }

  return 'unisexe';
}

// Fonction pour récupérer les tailles selon le genre
async function getSizesForGender(gender) {
  const genderFilter = gender === 'unisexe' ? null : gender;

  const { data: sizes, error } = await supabase
    .from('sizes')
    .select('id, size_display')
    .eq('is_active', true)
    .or(genderFilter ? `gender.eq.${genderFilter},gender.is.null` : 'gender.is.null')
    .order('sort_order');

  if (error) {
    console.error('❌ Erreur récupération tailles:', error);
    return [];
  }

  return sizes || [];
}

// Fonction principale d'import
async function importSneakersToSupabase(limit = 50) {
  console.log('🚀 Démarrage de l\'import vers Supabase\n');

  try {
    // 1. Tester la connexion Supabase
    const { data: testData, error: testError } = await supabase
      .from('brands')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Erreur connexion Supabase:', testError);
      return;
    }

    console.log('✅ Connexion Supabase OK\n');

    // 2. Scraper les données
    console.log('🔍 Récupération des données depuis l\'API...');
    const workingConfig = await scraper.testAPIConfigs();

    if (!workingConfig) {
      console.error('❌ Impossible de se connecter à l\'API sneakers');
      return;
    }

    const categorizedData = await scraper.scrapeSneakersByCategory(workingConfig.config, limit);

    // 3. Compter les données disponibles
    const totalSneakers = Object.values(categorizedData).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`📦 ${totalSneakers} sneakers récupérées\n`);

    if (totalSneakers === 0) {
      console.log('❌ Aucune donnée à importer');
      return;
    }

    // 4. Importer par catégorie
    const importResults = {
      imported: 0,
      failed: 0,
      byCategory: {}
    };

    for (const [category, sneakers] of Object.entries(categorizedData)) {
      if (sneakers.length === 0) continue;

      console.log(`\n👕 Import catégorie: ${category.toUpperCase()} (${sneakers.length} produits)`);

      let categoryImported = 0;
      for (const sneaker of sneakers) {
        const result = await importProduct(sneaker);
        if (result) {
          categoryImported++;
          importResults.imported++;
        } else {
          importResults.failed++;
        }

        // Pause entre les imports pour éviter de surcharger
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      importResults.byCategory[category] = categoryImported;
      console.log(`✅ ${categoryImported}/${sneakers.length} produits importés pour ${category}`);
    }

    // 5. Résultats finaux
    console.log('\n📊 RÉSULTATS DE L\'IMPORT:');
    console.log('=' .repeat(50));
    console.log(`✅ Importés: ${importResults.imported}`);
    console.log(`❌ Échecs: ${importResults.failed}`);
    console.log('\nPar catégorie:');
    Object.entries(importResults.byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

    console.log('\n🎉 Import terminé !');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Script exécutable
if (require.main === module) {
  const limit = process.argv[2] ? parseInt(process.argv[2]) : 20;
  console.log(`📝 Limite d'import: ${limit} produits par recherche\n`);
  importSneakersToSupabase(limit);
}

module.exports = {
  importSneakersToSupabase,
  importProduct,
  createOrGetBrand
};