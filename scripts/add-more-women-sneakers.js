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

// Nouvelles requêtes pour femmes (plus de variété)
const ADDITIONAL_WOMEN_QUERIES = [
  // Nike supplémentaires femmes
  'nike air max 97 women',
  'nike air max plus women',
  'nike react element women',
  'nike zoom pegasus women',
  'nike free run women',
  'nike air presto women',
  'nike huarache women',
  'nike air max sc women',
  'nike revolution women',
  'nike tanjun women',

  // Adidas supplémentaires femmes
  'adidas ultraboost women',
  'adidas nmd r1 women',
  'adidas continental 80 women',
  'adidas rivalry low women',
  'adidas sl 72 women',
  'adidas forum bold women',
  'adidas ozweego women',
  'adidas falcon women',

  // New Balance supplémentaires femmes
  'new balance 990 women',
  'new balance 574 women',
  'new balance 991 women',
  'new balance 993 women',
  'new balance 1500 women',

  // Converse supplémentaires femmes
  'converse one star women',
  'converse weapon women',
  'converse pro leather women',
  'converse run star hike women',

  // Puma supplémentaires femmes
  'puma speedcat women',
  'puma future rider women',
  'puma mirage sport women',
  'puma cell endura women',
  'puma rs-x women',
  'puma cali dream women',

  // ASICS supplémentaires femmes
  'asics gel nimbus women',
  'asics gel venture women',
  'asics japan s women',
  'asics gel 1130 women',
  'asics gel kayano women'
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

// Fonction pour valider les sneakers femmes
function isValidWomenSneaker(sneaker) {
  const name = (sneaker.name || '').toLowerCase();
  const brand = (sneaker.brand_name || '').toLowerCase();

  // Exclure les produits indésirables mais garder plus de variété
  const excludeTerms = [
    'wallet', 'card', 'custom', 'slides', 'sandal', 'flip', 'socks', 'shirt',
    'sample', 'promo only', 'not for resale', 'balenciaga', 'off-white'
  ];

  for (const term of excludeTerms) {
    if (name.includes(term)) return false;
  }

  // Vérifier que c'est bien une des marques autorisées
  const allowedBrands = ['nike', 'adidas', 'air jordan', 'jordan', 'new balance', 'converse', 'puma', 'asics'];
  if (!allowedBrands.some(b => brand.includes(b))) return false;

  // Prix raisonnable pour femmes
  if (!sneaker.retail_price_cents ||
      sneaker.retail_price_cents < 4000 ||
      sneaker.retail_price_cents > 25000) return false;

  // Vérifier que c'est bien pour femmes
  const womenTerms = ['women', 'wmns', 'w ', '(w)', 'ladies'];
  if (!womenTerms.some(term => name.includes(term))) return false;

  return true;
}

// Fonction pour importer un produit femme
async function importWomenSneaker(sneakerData) {
  try {
    if (!isValidWomenSneaker(sneakerData)) {
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
    const productName = name || 'Sneaker femme';
    const description = details || `${brand_name} ${color ? `coloris ${color}` : ''}`;
    const basePrice = retail_price_cents ? (retail_price_cents / 100) : 120;

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: productName,
        description: description,
        base_price: basePrice,
        gender: 'femme',
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

    // Créer le stock pour les tailles femmes
    const sizes = await getSizesForGender('femme');
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

    console.log(`✅ Produit femme importé: ${productName}`);
    return {
      product_id: product.id,
      variant_id: variant.id,
      name: productName,
      sku: variantSKU
    };

  } catch (error) {
    console.error('❌ Erreur import produit femme:', error);
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
async function searchWomenSneakers(query, limit = 6) {
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

// Fonction principale pour ajouter 20 sneakers femmes
async function addMoreWomenSneakers() {
  console.log('👩 Ajout de 20 sneakers supplémentaires pour femmes\n');

  let totalImported = 0;
  let totalProcessed = 0;

  for (const query of ADDITIONAL_WOMEN_QUERIES) {
    if (totalImported >= 20) break; // Arrêter une fois qu'on a 20 produits

    console.log(`🔍 Recherche: "${query}"`);

    const sneakers = await searchWomenSneakers(query, 5);
    console.log(`📦 ${sneakers.length} résultats trouvés`);

    for (const sneaker of sneakers) {
      if (totalImported >= 20) break; // Arrêter une fois qu'on a 20 produits

      totalProcessed++;
      const result = await importWomenSneaker(sneaker);
      if (result) {
        totalImported++;
        console.log(`📊 Progression: ${totalImported}/20 produits importés`);
      }

      // Pause pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  console.log(`\n📊 RÉSULTATS FINAUX FEMMES:`);
  console.log(`✅ Importés: ${totalImported}/20`);
  console.log(`📦 Traités: ${totalProcessed}`);
  console.log(`🎉 Ajout de produits femmes terminé !`);
}

// Exécution
if (require.main === module) {
  addMoreWomenSneakers();
}

module.exports = {
  addMoreWomenSneakers
};