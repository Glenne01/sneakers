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

// Requêtes spécifiques pour femmes
const WOMEN_QUERIES = [
  'nike air force 1 women',
  'nike dunk low women',
  'nike air max 90 women',
  'nike air jordan 1 women',
  'adidas stan smith women',
  'adidas gazelle women',
  'adidas samba women',
  'adidas superstar women',
  'new balance 550 women',
  'new balance 327 women',
  'converse chuck taylor women',
  'puma suede women',
  'asics gel lyte women'
];

// Requêtes spécifiques pour enfants
const KIDS_QUERIES = [
  'nike air force 1 kids',
  'nike dunk low kids',
  'nike air max kids',
  'nike jordan 1 kids',
  'adidas stan smith kids',
  'adidas superstar kids',
  'new balance 574 kids',
  'converse chuck taylor kids',
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

// Fonction pour valider les sneakers
function isValidSneaker(sneaker, targetGender) {
  const name = (sneaker.name || '').toLowerCase();
  const brand = (sneaker.brand_name || '').toLowerCase();

  // Exclure les produits indésirables
  const excludeTerms = [
    'wallet', 'card', 'custom', 'mi adidas', 'incense',
    'slides', 'sandal', 'flip', 'socks', 'shirt',
    'vintage', 'retro sp', 'fragment', 'travis scott',
    'yeezy', 'vans', 'old skool', 'sk8', 'era',
    'special edition', 'limited edition', 'promo'
  ];

  for (const term of excludeTerms) {
    if (name.includes(term)) return false;
  }

  // Vérifier que c'est bien une des marques autorisées
  const allowedBrands = ['nike', 'adidas', 'air jordan', 'jordan', 'new balance', 'converse', 'puma', 'asics'];
  if (!allowedBrands.some(b => brand.includes(b))) return false;

  // Vérifier qu'il y a un prix valide
  if (!sneaker.retail_price_cents || sneaker.retail_price_cents < 3000) return false;

  // Vérification du genre pour enfants
  if (targetGender === 'enfant') {
    const genderCheck = name.includes('kids') || name.includes('youth') || name.includes('child') ||
                       name.includes('ps') || name.includes('td') || name.includes('baby');
    if (!genderCheck) return false;
  }

  // Vérification du genre pour femmes
  if (targetGender === 'femme') {
    const genderCheck = name.includes('women') || name.includes('wmns') || name.includes('girls') ||
                       name.includes('w ') || name.includes('(w)');
    if (!genderCheck) return false;
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
    const basePrice = retail_price_cents ? (retail_price_cents / 100) : 120;

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
async function searchSneakers(query, limit = 15) {
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

// Fonction principale pour importer sneakers femmes
async function importWomenSneakers() {
  console.log('👩 Import de sneakers pour femmes\n');

  let totalImported = 0;
  let totalProcessed = 0;

  for (const query of WOMEN_QUERIES) {
    console.log(`🔍 Recherche: "${query}"`);

    const sneakers = await searchSneakers(query, 12);
    console.log(`📦 ${sneakers.length} résultats trouvés`);

    for (const sneaker of sneakers) {
      totalProcessed++;
      const result = await importSneaker(sneaker, 'femme');
      if (result) {
        totalImported++;
      }

      // Pause pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    // Pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 RÉSULTATS FEMMES:`);
  console.log(`✅ Importés: ${totalImported}`);
  console.log(`📦 Traités: ${totalProcessed}`);
}

// Fonction principale pour importer sneakers enfants
async function importKidsSneakers() {
  console.log('\n👶 Import de sneakers pour enfants\n');

  let totalImported = 0;
  let totalProcessed = 0;

  for (const query of KIDS_QUERIES) {
    console.log(`🔍 Recherche: "${query}"`);

    const sneakers = await searchSneakers(query, 10);
    console.log(`📦 ${sneakers.length} résultats trouvés`);

    for (const sneaker of sneakers) {
      totalProcessed++;
      const result = await importSneaker(sneaker, 'enfant');
      if (result) {
        totalImported++;
      }

      // Pause pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 1200));
  }

  console.log(`\n📊 RÉSULTATS ENFANTS:`);
  console.log(`✅ Importés: ${totalImported}`);
  console.log(`📦 Traités: ${totalProcessed}`);
}

// Exécution
async function main() {
  console.log('🚀 Import de sneakers tendances pour femmes et enfants\n');

  try {
    await importWomenSneakers();
    await importKidsSneakers();
    console.log('\n🎉 Import terminé pour toutes les catégories !');
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  importWomenSneakers,
  importKidsSneakers
};