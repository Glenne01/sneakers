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

// Requêtes plus ciblées pour les femmes (basées sur les vraies tendances)
const TRENDY_WOMEN_QUERIES = [
  // Nike tendances femmes
  'nike air force 1 07 women white',
  'nike dunk low women panda',
  'nike air max 90 women pink',
  'nike blazer mid 77 women',
  'nike court vision women',
  'nike air force 1 shadow women',
  'nike dunk low women white black',

  // Adidas tendances femmes
  'adidas gazelle women pink',
  'adidas stan smith women green',
  'adidas samba women white',
  'adidas campus women',
  'adidas superstar women white',
  'adidas forum low women',

  // New Balance tendances femmes
  'new balance 550 women white green',
  'new balance 327 women gray',
  'new balance 530 women',
  'new balance 2002r women',

  // Converse classiques femmes
  'converse chuck 70 women',
  'converse all star women white',
  'converse platform women',

  // Autres marques tendances femmes
  'puma cali sport women',
  'asics gel lyte iii women'
];

// Requêtes pour enfants (modèles populaires et accessibles)
const TRENDY_KIDS_QUERIES = [
  // Nike enfants
  'nike air force 1 kids white',
  'nike dunk low kids',
  'nike air max 90 kids',
  'nike cortez kids',
  'nike blazer kids',

  // Adidas enfants
  'adidas stan smith kids',
  'adidas superstar kids',
  'adidas gazelle kids',
  'adidas forum kids',

  // New Balance enfants
  'new balance 574 kids',
  'new balance 550 kids',

  // Converse enfants
  'converse all star kids',
  'converse chuck taylor kids',

  // Autres marques enfants
  'puma suede kids'
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

// Fonction améliorée pour valider les sneakers tendances
function isTrendySneaker(sneaker, targetGender) {
  const name = (sneaker.name || '').toLowerCase();
  const brand = (sneaker.brand_name || '').toLowerCase();

  // Exclure les collaborations trop exclusives et les produits indésirables
  const excludeTerms = [
    'balenciaga', 'off-white', 'travis scott', 'fragment', 'dior',
    'wallet', 'card', 'custom', 'vintage', 'retro sp',
    'slides', 'sandal', 'flip', 'socks', 'shirt',
    'limited edition', 'special edition', 'promo',
    'worn-out', 'distressed', 'sample'
  ];

  for (const term of excludeTerms) {
    if (name.includes(term)) return false;
  }

  // Vérifier que c'est bien une des marques autorisées
  const allowedBrands = ['nike', 'adidas', 'air jordan', 'jordan', 'new balance', 'converse', 'puma', 'asics'];
  if (!allowedBrands.some(b => brand.includes(b))) return false;

  // Prix raisonnable (pas trop cher pour être accessible)
  if (!sneaker.retail_price_cents ||
      sneaker.retail_price_cents < 4000 ||
      sneaker.retail_price_cents > 20000) return false;

  // Vérification spécifique du genre pour enfants
  if (targetGender === 'enfant') {
    const kidTerms = ['kids', 'youth', 'child', 'ps', 'td', 'little', 'big kids', 'grade school'];
    if (!kidTerms.some(term => name.includes(term))) return false;
  }

  // Vérification spécifique du genre pour femmes
  if (targetGender === 'femme') {
    const womenTerms = ['women', 'wmns', 'w ', '(w)', 'ladies'];
    if (!womenTerms.some(term => name.includes(term))) return false;
  }

  // Privilégier les modèles tendances classiques
  const trendyModels = [
    'air force 1', 'dunk low', 'air max', 'blazer', 'court vision',
    'stan smith', 'gazelle', 'samba', 'campus', 'superstar', 'forum',
    '550', '327', '530', '574', '2002r',
    'chuck taylor', 'all star', 'chuck 70',
    'suede', 'cali', 'gel lyte'
  ];

  if (!trendyModels.some(model => name.includes(model))) return false;

  return true;
}

// Fonction pour importer un produit
async function importTrendySneaker(sneakerData, targetGender) {
  try {
    if (!isTrendySneaker(sneakerData, targetGender)) {
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
    const basePrice = retail_price_cents ? (retail_price_cents / 100) : 110;

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
          quantity: Math.floor(Math.random() * 10) + 5,
          updated_at: new Date().toISOString()
        });
    }

    console.log(`✅ Produit tendance importé: ${productName} (${targetGender})`);
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
async function searchTrendySneakers(query, limit = 10) {
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

// Fonction principale pour importer sneakers femmes tendances
async function importTrendyWomenSneakers() {
  console.log('👩 Import de sneakers TENDANCES pour femmes\n');

  let totalImported = 0;
  let totalProcessed = 0;

  for (const query of TRENDY_WOMEN_QUERIES) {
    console.log(`🔍 Recherche: "${query}"`);

    const sneakers = await searchTrendySneakers(query, 8);
    console.log(`📦 ${sneakers.length} résultats trouvés`);

    for (const sneaker of sneakers) {
      totalProcessed++;
      const result = await importTrendySneaker(sneaker, 'femme');
      if (result) {
        totalImported++;
        if (totalImported >= 20) break; // Limiter à 20 produits max
      }

      // Pause pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (totalImported >= 20) break;

    // Pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  console.log(`\n📊 RÉSULTATS FEMMES TENDANCES:`);
  console.log(`✅ Importés: ${totalImported}`);
  console.log(`📦 Traités: ${totalProcessed}`);
}

// Fonction principale pour importer sneakers enfants tendances
async function importTrendyKidsSneakers() {
  console.log('\n👶 Import de sneakers TENDANCES pour enfants\n');

  let totalImported = 0;
  let totalProcessed = 0;

  for (const query of TRENDY_KIDS_QUERIES) {
    console.log(`🔍 Recherche: "${query}"`);

    const sneakers = await searchTrendySneakers(query, 6);
    console.log(`📦 ${sneakers.length} résultats trouvés`);

    for (const sneaker of sneakers) {
      totalProcessed++;
      const result = await importTrendySneaker(sneaker, 'enfant');
      if (result) {
        totalImported++;
        if (totalImported >= 15) break; // Limiter à 15 produits max
      }

      // Pause pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    if (totalImported >= 15) break;

    // Pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 RÉSULTATS ENFANTS TENDANCES:`);
  console.log(`✅ Importés: ${totalImported}`);
  console.log(`📦 Traités: ${totalProcessed}`);
}

// Exécution
async function main() {
  console.log('🚀 Import de sneakers VRAIMENT TENDANCES pour femmes et enfants\n');

  try {
    await importTrendyWomenSneakers();
    await importTrendyKidsSneakers();
    console.log('\n🎉 Import de produits tendances terminé !');
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  importTrendyWomenSneakers,
  importTrendyKidsSneakers
};