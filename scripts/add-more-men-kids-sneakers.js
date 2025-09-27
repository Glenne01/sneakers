require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration API
const API_CONFIG = {
  baseURL: 'https://sneaker-database-stockx.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Host': 'sneaker-database-stockx.p.rapidapi.com',
    'X-RapidAPI-Key': '2b4200e423msh8ef9150368bb69fp1abb38jsndf17086f3cc8'
  }
};

// Nouvelles requêtes pour hommes (plus de variété)
const ADDITIONAL_MEN_QUERIES = [
  // Nike supplémentaires
  'nike air max 97 men',
  'nike air max plus men',
  'nike react element men',
  'nike zoom vomero men',
  'nike pegasus men',
  'nike free run men',
  'nike air presto men',
  'nike huarache men',

  // Adidas supplémentaires
  'adidas ultraboost men',
  'adidas yeezy boost 350',
  'adidas nmd r1 men',
  'adidas continental 80 men',
  'adidas rivalry low men',
  'adidas handball spezial men',
  'adidas sl 72 men',

  // Air Jordan supplémentaires
  'air jordan 5 men',
  'air jordan 6 men',
  'air jordan 13 men',
  'air jordan legacy men',

  // New Balance supplémentaires
  'new balance 990 men',
  'new balance 991 men',
  'new balance 993 men',
  'new balance 1000 men',
  'new balance 1500 men',

  // Converse supplémentaires
  'converse one star men',
  'converse weapon men',
  'converse pro leather men',

  // Puma supplémentaires
  'puma speedcat men',
  'puma future rider men',
  'puma mirage sport men',
  'puma cell endura men',

  // ASICS supplémentaires
  'asics gel nimbus men',
  'asics gel venture men',
  'asics japan s men',
  'asics gel 1130 men'
];

// Requêtes supplémentaires pour enfants
const ADDITIONAL_KIDS_QUERIES = [
  // Nike enfants supplémentaires
  'nike air max 90 kids',
  'nike air max plus kids',
  'nike react kids',
  'nike free kids',
  'nike huarache kids',
  'nike presto kids',

  // Adidas enfants supplémentaires
  'adidas ultraboost kids',
  'adidas nmd kids',
  'adidas continental kids',
  'adidas rivalry kids',

  // Air Jordan enfants
  'air jordan 4 kids',
  'air jordan 5 kids',
  'air jordan 11 kids',
  'air jordan legacy kids',

  // New Balance enfants supplémentaires
  'new balance 990 kids',
  'new balance 327 kids',
  'new balance 550 kids',

  // Converse enfants supplémentaires
  'converse one star kids',
  'converse pro leather kids',

  // Puma enfants supplémentaires
  'puma future rider kids',
  'puma cali sport kids',

  // ASICS enfants supplémentaires
  'asics gel lyte kids',
  'asics gel venture kids'
];

// Fonction pour créer ou récupérer une marque
async function createOrGetBrand(brandName) {
  if (!brandName || brandName === 'Unknown') {
    brandName = 'Nike';
  }

  // Normaliser le nom de la marque
  if (brandName.toLowerCase().includes('jordan')) {
    brandName = 'Air Jordan';
  } else if (brandName.toLowerCase().includes('adidas')) {
    brandName = 'Adidas';
  }

  const { data: existingBrand } = await supabase
    .from('brands')
    .select('id')
    .eq('name', brandName)
    .single();

  if (existingBrand) {
    return existingBrand.id;
  }

  const { data: newBrand, error } = await supabase
    .from('brands')
    .insert({
      name: brandName,
      description: `Marque ${brandName}`,
      is_active: true
    })
    .select('id')
    .single();

  if (error) {
    console.error(`❌ Erreur création marque ${brandName}:`, error);
    return null;
  }

  console.log(`✅ Marque créée: ${brandName}`);
  return newBrand.id;
}

// Fonction pour valider les sneakers
function isValidSneaker(sneaker, targetGender) {
  const name = (sneaker.name || '').toLowerCase();
  const brand = (sneaker.brand_name || '').toLowerCase();

  // Exclure les produits indésirables mais garder plus de variété
  const excludeTerms = [
    'wallet', 'card', 'custom', 'slides', 'sandal', 'flip', 'socks', 'shirt',
    'sample', 'promo only', 'not for resale'
  ];

  for (const term of excludeTerms) {
    if (name.includes(term)) return false;
  }

  // Vérifier que c'est bien une des marques autorisées
  const allowedBrands = ['nike', 'adidas', 'air jordan', 'jordan', 'new balance', 'converse', 'puma', 'asics'];
  if (!allowedBrands.some(b => brand.includes(b))) return false;

  // Prix raisonnable
  if (!sneaker.retail_price_cents ||
      sneaker.retail_price_cents < 3000 ||
      sneaker.retail_price_cents > 40000) return false;

  // Vérification du genre pour enfants
  if (targetGender === 'enfant') {
    const kidTerms = ['kids', 'youth', 'child', 'ps', 'td', 'little', 'big kids', 'grade school', 'gs'];
    if (!kidTerms.some(term => name.includes(term))) return false;
  }

  // Pour les hommes, exclure les modèles femmes
  if (targetGender === 'homme') {
    const womenTerms = ['women', 'wmns', 'w ', '(w)', 'ladies'];
    if (womenTerms.some(term => name.includes(term))) return false;
  }

  return true;
}

// Fonction pour importer un produit
async function importSneaker(sneakerData, targetGender) {
  try {
    if (!isValidSneaker(sneakerData, targetGender)) {
      return null;
    }

    const {
      name,
      brand_name,
      color,
      retail_price_cents,
      main_picture_url,
      grid_picture_url,
      sku,
      details
    } = sneakerData;

    // Vérifier si le SKU existe déjà
    if (sku) {
      const { data: existingVariant } = await supabase
        .from('product_variants')
        .select('id')
        .eq('sku', sku)
        .single();

      if (existingVariant) {
        return null; // Produit déjà existant
      }
    }

    // Créer la marque
    const brandId = await createOrGetBrand(brand_name);
    if (!brandId) return null;

    // Créer le produit
    const productName = name || 'Sneaker tendance';
    const description = details || `${brand_name} ${color ? `coloris ${color}` : ''}`;
    const basePrice = retail_price_cents ? (retail_price_cents / 100) : 130;

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: productName,
        description: description,
        base_price: basePrice,
        gender: targetGender,
        brand_id: brandId,
        is_active: true
      })
      .select('id')
      .single();

    if (productError) {
      console.error(`❌ Erreur création produit ${productName}:`, productError);
      return null;
    }

    // Créer la variante
    const variantSKU = sku || `${brand_name?.slice(0,3).toUpperCase()}-${Date.now()}`;
    const imageUrl = main_picture_url || grid_picture_url;

    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .insert({
        product_id: product.id,
        sku: variantSKU,
        color: color || 'Standard',
        price: basePrice,
        image_url: imageUrl,
        is_active: true
      })
      .select('id')
      .single();

    if (variantError) {
      console.error(`❌ Erreur création variante:`, variantError);
      return null;
    }

    // Créer le stock pour les tailles appropriées
    const sizes = await getSizesForGender(targetGender);
    for (const size of sizes) {
      await supabase
        .from('product_stock')
        .insert({
          variant_id: variant.id,
          size_id: size.id,
          quantity: Math.floor(Math.random() * 12) + 3,
          updated_at: new Date().toISOString()
        });
    }

    console.log(`✅ Produit importé: ${productName} (${targetGender})`);
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

// Fonction pour récupérer les tailles
async function getSizesForGender(gender) {
  const { data: sizes, error } = await supabase
    .from('sizes')
    .select('id, size_display')
    .eq('is_active', true)
    .or(`gender.eq.${gender},gender.is.null`)
    .order('sort_order');

  if (error) {
    console.error('❌ Erreur récupération tailles:', error);
    return [];
  }

  return sizes || [];
}

// Fonction pour chercher des sneakers par requête
async function searchSneakers(query, limit = 8) {
  try {
    const response = await axios.get('/goat-search', {
      ...API_CONFIG,
      params: { query },
      timeout: 15000
    });

    let sneakers = [];
    if (response.data && response.data.product && Array.isArray(response.data.product)) {
      sneakers = response.data.product;
    }

    return sneakers.slice(0, limit);
  } catch (error) {
    console.error(`❌ Erreur recherche "${query}":`, error.message);
    return [];
  }
}

// Fonction principale pour ajouter plus de sneakers hommes
async function addMoreMenSneakers() {
  console.log('👨 Ajout de sneakers supplémentaires pour hommes\n');

  let totalImported = 0;
  let totalProcessed = 0;

  for (const query of ADDITIONAL_MEN_QUERIES) {
    console.log(`🔍 Recherche: "${query}"`);

    const sneakers = await searchSneakers(query, 6);
    console.log(`📦 ${sneakers.length} résultats trouvés`);

    for (const sneaker of sneakers) {
      totalProcessed++;
      const result = await importSneaker(sneaker, 'homme');
      if (result) {
        totalImported++;
        if (totalImported >= 30) break; // Limiter à 30 produits supplémentaires
      }

      // Pause pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (totalImported >= 30) break;

    // Pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  console.log(`\n📊 RÉSULTATS HOMMES SUPPLÉMENTAIRES:`);
  console.log(`✅ Importés: ${totalImported}`);
  console.log(`📦 Traités: ${totalProcessed}`);
}

// Fonction principale pour ajouter plus de sneakers enfants
async function addMoreKidsSneakers() {
  console.log('\n👶 Ajout de sneakers supplémentaires pour enfants\n');

  let totalImported = 0;
  let totalProcessed = 0;

  for (const query of ADDITIONAL_KIDS_QUERIES) {
    console.log(`🔍 Recherche: "${query}"`);

    const sneakers = await searchSneakers(query, 5);
    console.log(`📦 ${sneakers.length} résultats trouvés`);

    for (const sneaker of sneakers) {
      totalProcessed++;
      const result = await importSneaker(sneaker, 'enfant');
      if (result) {
        totalImported++;
        if (totalImported >= 20) break; // Limiter à 20 produits supplémentaires
      }

      // Pause pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    if (totalImported >= 20) break;

    // Pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 RÉSULTATS ENFANTS SUPPLÉMENTAIRES:`);
  console.log(`✅ Importés: ${totalImported}`);
  console.log(`📦 Traités: ${totalProcessed}`);
}

// Exécution
async function main() {
  console.log('🚀 Ajout de sneakers supplémentaires pour hommes et enfants\n');

  try {
    await addMoreMenSneakers();
    await addMoreKidsSneakers();
    console.log('\n🎉 Ajout de produits supplémentaires terminé !');
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  addMoreMenSneakers,
  addMoreKidsSneakers
};