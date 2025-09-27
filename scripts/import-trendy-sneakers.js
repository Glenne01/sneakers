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

// Marques autorisées et leurs requêtes tendances
const TRENDING_BRANDS = {
  'Nike': [
    'nike air jordan 1',
    'nike air force 1',
    'nike dunk low',
    'nike air max 90',
    'nike air max 1',
    'nike blazer mid',
    'nike court vision',
    'nike revolution'
  ],
  'Adidas': [
    'adidas stan smith',
    'adidas gazelle',
    'adidas samba',
    'adidas campus',
    'adidas superstar',
    'adidas forum low',
    'adidas ozweego',
    'adidas nmd'
  ],
  'Jordan': [
    'air jordan 1 low',
    'air jordan 1 mid',
    'air jordan 1 high',
    'air jordan 4',
    'air jordan 11',
    'air jordan 3',
    'air jordan 12'
  ],
  'New Balance': [
    'new balance 530',
    'new balance 550',
    'new balance 574',
    'new balance 327',
    'new balance 2002r',
    'new balance 990'
  ],
  'Converse': [
    'converse chuck taylor',
    'converse all star',
    'converse chuck 70',
    'converse one star'
  ],
  'Puma': [
    'puma suede',
    'puma cali',
    'puma rs-x',
    'puma clyde',
    'puma palermo'
  ],
  'ASICS': [
    'asics gel lyte',
    'asics gel kayano',
    'asics gel nimbus',
    'asics japan s'
  ]
};

// Fonction pour nettoyer et filtrer les produits
function isValidTrendySneaker(sneaker) {
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

  // Vérifier que c'est bien une des marques autorisées (plus strict)
  const allowedBrands = ['nike', 'adidas', 'air jordan', 'jordan', 'new balance', 'converse', 'puma', 'asics'];
  if (!allowedBrands.some(b => brand.includes(b))) return false;

  // Vérifier que c'est une vraie sneaker tendance
  const sneakerTerms = ['air force', 'air max', 'dunk low', 'dunk high', 'jordan 1', 'jordan 4', 'jordan 11', 'stan smith', 'gazelle', 'samba', 'campus', 'superstar', 'chuck taylor', 'chuck 70', 'suede classic', 'gel lyte', 'new balance 550', 'new balance 327', 'new balance 530'];
  if (!sneakerTerms.some(term => name.includes(term))) return false;

  // Vérifier qu'il y a un prix valide
  if (!sneaker.retail_price_cents || sneaker.retail_price_cents < 5000) return false;

  return true;
}

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

// Fonction pour mapper le genre
function mapGender(apiGender, singleGender) {
  if (singleGender) {
    const gender = singleGender.toLowerCase();
    if (gender.includes('men') && !gender.includes('women')) return 'homme';
    if (gender.includes('women') || gender.includes('girls')) return 'femme';
    if (gender.includes('kids') || gender.includes('youth') || gender.includes('child')) return 'enfant';
  }

  if (Array.isArray(apiGender)) {
    for (const genderItem of apiGender) {
      const gender = genderItem.toLowerCase();
      if (gender.includes('men') && !gender.includes('women')) return 'homme';
      if (gender.includes('women') || gender.includes('girls')) return 'femme';
      if (gender.includes('kids') || gender.includes('youth') || gender.includes('child')) return 'enfant';
    }
  }

  return 'homme'; // Par défaut homme pour les tendances
}

// Fonction pour importer un produit
async function importTrendyProduct(sneakerData) {
  try {
    if (!isValidTrendySneaker(sneakerData)) {
      return null;
    }

    const {
      name,
      brand_name,
      color,
      retail_price_cents,
      gender,
      single_gender,
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
    const basePrice = retail_price_cents ? (retail_price_cents / 100) : 150;
    const productGender = mapGender(gender, single_gender);

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: productName,
        description: description,
        base_price: basePrice,
        gender: productGender,
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

    // Créer le stock pour les tailles homme (39-46)
    const sizes = await getSizesForGender(productGender);
    for (const size of sizes) {
      await supabase
        .from('product_stock')
        .insert({
          variant_id: variant.id,
          size_id: size.id,
          quantity: Math.floor(Math.random() * 15) + 5,
          updated_at: new Date().toISOString()
        });
    }

    console.log(`✅ Produit importé: ${productName}`);
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

// Fonction pour chercher des sneakers par requête
async function searchTrendySneakers(query, limit = 20) {
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

// Fonction principale
async function importTrendySneakersForMen() {
  console.log('🚀 Import de sneakers tendances pour hommes\n');

  let totalImported = 0;
  let totalProcessed = 0;

  for (const [brandName, queries] of Object.entries(TRENDING_BRANDS)) {
    console.log(`\n👟 Import marque: ${brandName}`);

    for (const query of queries) {
      console.log(`🔍 Recherche: "${query}"`);

      const sneakers = await searchTrendySneakers(query, 10);
      console.log(`📦 ${sneakers.length} résultats trouvés`);

      for (const sneaker of sneakers) {
        totalProcessed++;
        const result = await importTrendyProduct(sneaker);
        if (result) {
          totalImported++;
        }

        // Pause pour éviter la surcharge
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Pause entre les requêtes
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  console.log(`\n📊 RÉSULTATS:`);
  console.log(`✅ Importés: ${totalImported}`);
  console.log(`📦 Traités: ${totalProcessed}`);
  console.log(`🎉 Import terminé !`);
}

// Exécution
if (require.main === module) {
  importTrendySneakersForMen();
}

module.exports = {
  importTrendySneakersForMen,
  importTrendyProduct
};