require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Produits à ajouter rapidement
const quickProducts = [
  // New Balance
  { brand: 'New Balance', name: 'New Balance 550 White Green', color: 'White/Green', price: 110, sku: 'NB550-WG' },
  { brand: 'New Balance', name: 'New Balance 327 Casablanca', color: 'Beige/Orange', price: 90, sku: 'NB327-CB' },
  { brand: 'New Balance', name: 'New Balance 530 White Silver', color: 'White/Silver', price: 85, sku: 'NB530-WS' },
  { brand: 'New Balance', name: 'New Balance 2002R Protection Pack', color: 'Grey/Black', price: 150, sku: 'NB2002R-PP' },

  // Puma
  { brand: 'Puma', name: 'Puma Suede Classic XXI', color: 'Black/White', price: 75, sku: 'PUMA-SC21' },
  { brand: 'Puma', name: 'Puma Cali Sport Heritage', color: 'White/Pink', price: 80, sku: 'PUMA-CSH' },
  { brand: 'Puma', name: 'Puma RS-X Efekt', color: 'Multi-Color', price: 120, sku: 'PUMA-RSX' },
  { brand: 'Puma', name: 'Puma Palermo Leather', color: 'Green/White', price: 90, sku: 'PUMA-PAL' },

  // ASICS
  { brand: 'ASICS', name: 'ASICS Gel-Lyte III OG', color: 'Cream/Burgundy', price: 130, sku: 'ASICS-GL3' },
  { brand: 'ASICS', name: 'ASICS Gel-Kayano 14', color: 'Silver/Blue', price: 160, sku: 'ASICS-GK14' },
  { brand: 'ASICS', name: 'ASICS Japan S', color: 'White/Navy', price: 85, sku: 'ASICS-JS' },
  { brand: 'ASICS', name: 'ASICS Gel-Nimbus 9', color: 'Olive/Beige', price: 140, sku: 'ASICS-GN9' }
];

async function createOrGetBrand(brandName) {
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

async function getSizesForGender(gender = 'homme') {
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

async function addQuickProducts() {
  console.log('🚀 Ajout rapide des produits New Balance, Puma, ASICS...\n');

  for (const productData of quickProducts) {
    try {
      // Vérifier si le SKU existe déjà
      const { data: existingVariant } = await supabase
        .from('product_variants')
        .select('id')
        .eq('sku', productData.sku)
        .single();

      if (existingVariant) {
        console.log(`⚠️  Produit déjà existant: ${productData.name}`);
        continue;
      }

      // Créer la marque
      const brandId = await createOrGetBrand(productData.brand);
      if (!brandId) continue;

      // Créer le produit
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: `${productData.brand} ${productData.color}`,
          base_price: productData.price,
          gender: 'homme',
          brand_id: brandId,
          is_active: true
        })
        .select('id')
        .single();

      if (productError) {
        console.error(`❌ Erreur création produit ${productData.name}:`, productError);
        continue;
      }

      // Créer la variante
      const { data: variant, error: variantError } = await supabase
        .from('product_variants')
        .insert({
          product_id: product.id,
          sku: productData.sku,
          color: productData.color,
          price: productData.price,
          image_url: 'https://via.placeholder.com/400x400',
          is_active: true
        })
        .select('id')
        .single();

      if (variantError) {
        console.error(`❌ Erreur création variante:`, variantError);
        continue;
      }

      // Créer le stock pour les tailles homme
      const sizes = await getSizesForGender('homme');
      for (const size of sizes.slice(0, 8)) { // Premières 8 tailles
        await supabase
          .from('product_stock')
          .insert({
            variant_id: variant.id,
            size_id: size.id,
            quantity: Math.floor(Math.random() * 10) + 5,
            updated_at: new Date().toISOString()
          });
      }

      console.log(`✅ Produit ajouté: ${productData.name}`);

    } catch (error) {
      console.error(`❌ Erreur pour ${productData.name}:`, error);
    }
  }

  console.log('\n🎉 Ajout rapide terminé !');
}

addQuickProducts();