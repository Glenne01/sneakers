const axios = require('axios');

// Configuration de l'API RapidAPI - Version corrigée
const RAPIDAPI_CONFIGS = [
  {
    name: 'Config 1 - sneaker-database-stockx',
    baseURL: 'https://sneaker-database-stockx.p.rapidapi.com',
    headers: {
      'X-RapidAPI-Host': 'sneaker-database-stockx.p.rapidapi.com',
      'X-RapidAPI-Key': '2b4200e423msh8ef9150368bb69fp1abb38jsndf17086f3cc8'
    }
  },
  {
    name: 'Config 2 - sneaker-daase-stockx (typo original)',
    baseURL: 'https://sneaker-daase-stockx.p.rapidapi.com',
    headers: {
      'X-RapidAPI-Host': 'sneaker-daase-stockx.p.rapidapi.com',
      'X-RapidAPI-Key': '2b4200e423msh8ef9150368bb69fp1abb38jsndf17086f3cc8'
    }
  }
];

// Catégories pour filtrer par genre
const CATEGORIES = {
  homme: ['men', 'mens', 'man', 'male'],
  femme: ['women', 'womens', 'woman', 'female', 'girls'],
  enfant: ['kids', 'children', 'child', 'youth', 'junior', 'gs', 'ps', 'td']
};

// Requêtes de test par marque et modèle
const TEST_QUERIES = [
  'adidas campus',
  'adidas stan smith',
  'adidas gazelle',
  'adidas superstar',
  'nike air force',
  'nike air max',
  'yeezy 350',
  'jordan 1',
  'converse chuck',
  'vans old skool'
];

// Fonction pour tester les configurations d'API
async function testAPIConfigs() {
  console.log('🔄 Test des configurations API...\n');

  for (const config of RAPIDAPI_CONFIGS) {
    console.log(`\n🔍 Test de ${config.name}`);
    console.log(`URL: ${config.baseURL}`);

    try {
      // Test endpoint goat-search avec une requête simple
      const response = await axios.get('/goat-search', {
        ...config,
        params: { query: 'adidas' },
        timeout: 10000
      });

      console.log(`✅ ${config.name} fonctionne !`);
      console.log(`📊 Type de réponse: ${typeof response.data}`);

      // Gérer les différents formats de réponse
      let sneakers = [];

      if (Array.isArray(response.data)) {
        sneakers = response.data;
        console.log(`📈 Nombre de résultats (array): ${sneakers.length}`);
      } else if (response.data && typeof response.data === 'object') {
        console.log('📄 Réponse objet avec clés:', Object.keys(response.data));

        // Vérifier si la réponse contient un tableau dans une propriété
        if (response.data.product && Array.isArray(response.data.product)) {
          sneakers = response.data.product;
          console.log(`📈 Nombre de résultats (product array): ${sneakers.length}`);
        } else if (response.data.results && Array.isArray(response.data.results)) {
          sneakers = response.data.results;
          console.log(`📈 Nombre de résultats (results array): ${sneakers.length}`);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          sneakers = response.data.data;
          console.log(`📈 Nombre de résultats (data array): ${sneakers.length}`);
        } else {
          // Si c'est un objet unique, le traiter comme un seul résultat
          sneakers = [response.data];
          console.log(`📈 Objet unique converti en array`);
        }
      }

      if (sneakers.length > 0) {
        const firstItem = sneakers[0];
        console.log('\n📋 Structure du premier résultat:');
        console.log('Clés disponibles:', Object.keys(firstItem));

        // Afficher les champs importants
        const importantFields = ['name', 'brand', 'silhouette', 'colorway', 'retailPrice', 'releaseDate', 'image', 'thumbnail', 'links'];
        importantFields.forEach(field => {
          if (firstItem[field] !== undefined) {
            const value = typeof firstItem[field] === 'string' && firstItem[field].length > 50
              ? firstItem[field].slice(0, 50) + '...'
              : firstItem[field];
            console.log(`  ${field}: ${JSON.stringify(value)}`);
          }
        });

        return { config, data: sneakers };
      }

    } catch (error) {
      console.log(`❌ ${config.name} échoué:`);
      console.log(`   Status: ${error.response?.status || 'No response'}`);
      console.log(`   Message: ${error.response?.statusText || error.message}`);

      if (error.response?.data) {
        console.log(`   Détail:`, error.response.data);
      }
    }

    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return null;
}

// Fonction pour scraper des sneakers par catégorie
async function scrapeSneakersByCategory(config, maxResults = 50) {
  console.log('\n🎯 Scraping par catégorie...\n');

  const results = {
    homme: [],
    femme: [],
    enfant: [],
    unclassified: []
  };

  for (const query of TEST_QUERIES) {
    try {
      console.log(`🔍 Recherche: "${query}"`);

      const response = await axios.get('/goat-search', {
        ...config,
        params: { query },
        timeout: 15000
      });

      let sneakers = [];

      // Gérer les différents formats de réponse - l'API retourne toujours { "product": [...] }
      if (response.data && response.data.product && Array.isArray(response.data.product)) {
        sneakers = response.data.product;
      } else if (Array.isArray(response.data)) {
        sneakers = response.data;
      } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
        sneakers = response.data.results;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        sneakers = response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        // Si c'est un objet unique, le traiter comme un seul résultat
        sneakers = [response.data];
      }

      if (sneakers.length > 0) {
        console.log(`📦 ${sneakers.length} résultats trouvés`);

        for (const sneaker of sneakers.slice(0, maxResults)) {
          const category = categorizeSneaker(sneaker);
          results[category].push({
            ...sneaker,
            category,
            search_query: query
          });
        }
      } else {
        console.log(`❌ Aucun résultat pour "${query}"`);
      }

    } catch (error) {
      console.log(`❌ Erreur pour "${query}":`, error.response?.status || error.message);
    }

    // Pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  return results;
}

// Fonction pour catégoriser une sneaker par genre
function categorizeSneaker(sneaker) {
  const name = (sneaker.name || '').toLowerCase();
  const silhouette = (sneaker.silhouette || '').toLowerCase();
  const fullText = `${name} ${silhouette}`.toLowerCase();

  // Vérifier homme
  if (CATEGORIES.homme.some(keyword => fullText.includes(keyword))) {
    return 'homme';
  }

  // Vérifier femme
  if (CATEGORIES.femme.some(keyword => fullText.includes(keyword))) {
    return 'femme';
  }

  // Vérifier enfant
  if (CATEGORIES.enfant.some(keyword => fullText.includes(keyword))) {
    return 'enfant';
  }

  // Par défaut - non classifié (pourra être catégorisé manuellement)
  return 'unclassified';
}

// Fonction pour mapper les données API vers notre schéma Supabase
function mapToSupabaseSchema(sneaker) {
  return {
    // Table products
    product: {
      name: sneaker.name || sneaker.silhouette || 'Unknown Sneaker',
      description: createDescription(sneaker),
      base_price: parsePrice(sneaker.retail_price_cents || sneaker.retail_price_cents_usd),
      gender: mapGender(sneaker.category),
      brand_name: sneaker.brand_name || sneaker.brand || 'Unknown',
      is_active: true
    },
    // Table product_variants
    variant: {
      sku: sneaker.sku || generateSKU(sneaker),
      color: sneaker.color || sneaker.colorway || sneaker.details || 'Unknown',
      price: parsePrice(sneaker.retail_price_cents || sneaker.retail_price_cents_usd),
      image_url: sneaker.main_picture_url || sneaker.grid_picture_url || sneaker.image || sneaker.thumbnail,
      is_active: true
    },
    // Métadonnées supplémentaires
    metadata: {
      release_date: sneaker.release_date,
      original_id: sneaker.id,
      source: 'rapidapi-sneaker-db',
      links: sneaker.links,
      single_gender: sneaker.single_gender,
      size: sneaker.size,
      allowed_sizes: sneaker.allowed_sizes
    }
  };
}

// Fonctions utilitaires
function createDescription(sneaker) {
  const parts = [];
  if (sneaker.brand_name) parts.push(`${sneaker.brand_name}`);
  if (sneaker.silhouette) parts.push(`${sneaker.silhouette}`);
  if (sneaker.color || sneaker.colorway || sneaker.details) {
    const colorInfo = sneaker.color || sneaker.colorway || sneaker.details;
    parts.push(`coloris ${colorInfo}`);
  }
  if (sneaker.release_date) {
    const year = new Date(sneaker.release_date).getFullYear();
    parts.push(`sortie ${year}`);
  }

  return parts.length > 0 ? parts.join(' - ') : 'Sneaker premium';
}

function parsePrice(priceCents) {
  if (!priceCents) return 0;
  // L'API retourne les prix en cents, on divise par 100 pour avoir le prix en euros/dollars
  const price = parseFloat(priceCents) / 100;
  return isNaN(price) ? 0 : price;
}

function mapGender(category) {
  const mapping = {
    'homme': 'homme',
    'femme': 'femme',
    'enfant': 'enfant',
    'unclassified': 'unisexe'
  };
  return mapping[category] || 'unisexe';
}

function generateSKU(sneaker) {
  const brand = (sneaker.brand_name || sneaker.brand || 'UNK').substring(0, 3).toUpperCase();
  const name = (sneaker.name || sneaker.silhouette || 'SNEAKER')
    .replace(/[^A-Za-z0-9]/g, '')
    .substring(0, 6)
    .toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();

  return `${brand}-${name}-${random}`;
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage du scraper Sneaker Database\n');
  console.log('📅', new Date().toLocaleString());
  console.log('=' .repeat(60));

  try {
    // 1. Tester les configurations API
    const workingConfig = await testAPIConfigs();

    if (!workingConfig) {
      console.log('\n❌ Aucune configuration API ne fonctionne');
      console.log('🔧 Vérifiez:');
      console.log('   - L\'URL de l\'API');
      console.log('   - La clé API RapidAPI');
      console.log('   - Les quotas/limites');
      return;
    }

    console.log(`\n✅ Configuration fonctionnelle trouvée: ${workingConfig.config.name}`);

    // 2. Scraper les données par catégorie
    const categorizedData = await scrapeSneakersByCategory(workingConfig.config, 20);

    // 3. Afficher les résultats
    console.log('\n📊 RÉSULTATS PAR CATÉGORIE:');
    console.log('=' .repeat(60));

    Object.entries(categorizedData).forEach(([category, sneakers]) => {
      console.log(`\n👕 ${category.toUpperCase()}: ${sneakers.length} sneakers`);

      if (sneakers.length > 0) {
        console.log('   Top 3:');
        sneakers.slice(0, 3).forEach((sneaker, index) => {
          console.log(`   ${index + 1}. ${sneaker.name || sneaker.silhouette}`);
          console.log(`      ${sneaker.brand_name} - ${sneaker.color || sneaker.details || 'N/A'}`);
          const price = sneaker.retail_price_cents ? `${sneaker.retail_price_cents / 100}€` : 'N/A';
          console.log(`      Prix: ${price}`);
        });
      }
    });

    // 4. Préparer les données pour Supabase
    console.log('\n🗄️  PRÉPARATION POUR SUPABASE:');
    console.log('=' .repeat(60));

    const supabaseData = [];
    Object.entries(categorizedData).forEach(([category, sneakers]) => {
      sneakers.forEach(sneaker => {
        const mapped = mapToSupabaseSchema({ ...sneaker, category });
        supabaseData.push(mapped);
      });
    });

    console.log(`📦 ${supabaseData.length} sneakers prêtes pour l'import`);
    console.log('✅ Données mappées vers le schéma Supabase');

    // 5. Sauvegarder les résultats
    const fs = require('fs');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `sneakers-data-${timestamp}.json`;

    fs.writeFileSync(filename, JSON.stringify({
      scraping_date: new Date().toISOString(),
      total_sneakers: supabaseData.length,
      categories: Object.fromEntries(
        Object.entries(categorizedData).map(([k, v]) => [k, v.length])
      ),
      data: supabaseData
    }, null, 2));

    console.log(`💾 Données sauvegardées: ${filename}`);

  } catch (error) {
    console.error('\n❌ Erreur générale:', error.message);
    console.error(error.stack);
  }

  console.log('\n🎉 Scraping terminé !');
}

// Exécution si appelé directement
if (require.main === module) {
  main();
}

module.exports = {
  testAPIConfigs,
  scrapeSneakersByCategory,
  mapToSupabaseSchema,
  categorizeSneaker
};