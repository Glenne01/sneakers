const axios = require('axios');

// Configuration de l'API RapidAPI Sneaker Database
const RAPIDAPI_CONFIG = {
  baseURL: 'https://sneaker-database-stockx.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Host': 'sneaker-database-stockx.p.rapidapi.com',
    'X-RapidAPI-Key': '2b4200e423msh8ef9150368bb69fp1abb38jsndf17086f3cc8'
  }
};

// Fonction pour tester différentes requêtes
async function testSneakerAPI() {
  console.log('🔄 Test de l\'API Sneaker Database...\n');

  const testQueries = [
    'adidas',
    'yeezy',
    'nike',
    'jordan',
    'campus'
  ];

  for (const query of testQueries) {
    try {
      console.log(`🔍 Test requête: "${query}"`);

      const response = await axios.get('/goat-search', {
        ...RAPIDAPI_CONFIG,
        params: { query }
      });

      console.log(`📊 Type de réponse: ${typeof response.data}`);
      console.log('📋 Structure de la réponse:', Object.keys(response.data || {}));
      console.log('📄 Réponse complète:', JSON.stringify(response.data, null, 2));

      let sneakers = [];
      if (Array.isArray(response.data)) {
        sneakers = response.data;
      } else if (response.data && response.data.product && Array.isArray(response.data.product)) {
        sneakers = response.data.product;
      } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
        sneakers = response.data.results;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        sneakers = response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        sneakers = [response.data];
      }

      if (sneakers && sneakers.length > 0) {
        console.log(`✅ ${sneakers.length} résultats trouvés`);

        // Analyser la structure du premier résultat
        const firstItem = sneakers[0];
        console.log('📋 Structure des données:');
        console.log('  - Clés disponibles:', Object.keys(firstItem));

        // Afficher les informations importantes
        if (firstItem.name) console.log(`  - Nom: ${firstItem.name}`);
        if (firstItem.brand) console.log(`  - Marque: ${firstItem.brand}`);
        if (firstItem.silhouette) console.log(`  - Modèle: ${firstItem.silhouette}`);
        if (firstItem.retailPrice) console.log(`  - Prix: ${firstItem.retailPrice}`);
        if (firstItem.releaseDate) console.log(`  - Date sortie: ${firstItem.releaseDate}`);
        if (firstItem.image) console.log(`  - Image: ${firstItem.image.slice(0, 50)}...`);
        if (firstItem.links) console.log(`  - Liens: ${Object.keys(firstItem.links || {})}`);

        console.log('\n📄 Premier résultat complet:');
        console.log(JSON.stringify(firstItem, null, 2));
        console.log('\n' + '='.repeat(80) + '\n');

        // Ne pas tester les autres si on a trouvé des données
        break;
      } else {
        console.log(`❌ Aucun résultat pour "${query}"`);
      }
    } catch (error) {
      console.error(`❌ Erreur pour "${query}":`, error.response?.status, error.response?.statusText);
      if (error.response?.data) {
        console.error('Détail erreur:', error.response.data);
      }
    }

    // Pause entre les requêtes pour éviter le rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Fonction pour tester des endpoints spécifiques
async function testSpecificEndpoints() {
  console.log('🔄 Test des endpoints spécifiques...\n');

  const endpoints = [
    '/brands',
    '/silhouettes',
    '/products',
    '/search',
    '/goat-search'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Test endpoint: ${endpoint}`);

      const response = await axios.get(endpoint, RAPIDAPI_CONFIG);
      console.log(`✅ ${endpoint} disponible`);
      console.log('📋 Réponse:', typeof response.data, Array.isArray(response.data) ? `Array[${response.data.length}]` : 'Object');

    } catch (error) {
      console.log(`❌ ${endpoint} non disponible:`, error.response?.status);
    }
  }
}

// Exécution du script
async function main() {
  console.log('🚀 Démarrage du test API Sneaker Database\n');

  try {
    await testSneakerAPI();
    await testSpecificEndpoints();
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }

  console.log('✅ Test terminé');
}

main();