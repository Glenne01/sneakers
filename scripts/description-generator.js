// Description generator utility for sneaker import scripts

function generateProductDescription(productName, brandName, color, gender) {
  // Clean and normalize brand name
  const brand = normalizeBrandName(brandName);

  // Generate description based on brand
  switch (brand) {
    case 'Nike':
      return `La ${productName}${color ? ` en coloris ${color}` : ''} représente l'excellence de Nike en matière d'innovation. Cette sneaker combine technologies de pointe et style streetwear, offrant un confort exceptionnel grâce aux technologies Air et Zoom. Son design iconique et sa qualité premium en font un must-have pour tous les passionnés de sneakers.`;

    case 'Adidas':
      return `La ${productName}${color ? ` coloris ${color}` : ''} incarne l'héritage sportif d'Adidas. Dotée des technologies Boost et Primeknit, cette sneaker offre un amorti réactif et un ajustement parfait. Son design moderne mélange performance et style urbain, parfaite pour le sport comme pour la mode.`;

    case 'Air Jordan':
      return `La ${productName}${color ? ` en ${color}` : ''} perpétue la légende de Michael Jordan. Cette sneaker emblématique combine héritage basketball et style contemporain. Avec sa technologie Air et son design iconique, elle représente l'excellence sur et en dehors du terrain. Un classique intemporel qui transcende les générations.`;

    case 'New Balance':
      return `La ${productName}${color ? ` coloris ${color}` : ''} illustre l'expertise technique de New Balance. Fabriquée avec des matériaux premium et des technologies d'amorti avancées, cette sneaker offre confort et durabilité exceptionnels. Son design rétro-moderne et sa qualité de fabrication en font une référence en matière de sneakers lifestyle.`;

    case 'Converse':
      return `La ${productName}${color ? ` en ${color}` : ''} reflète l'esprit rebelle et authentique de Converse. Cette sneaker iconique au design intemporel traverse les décennies sans perdre de son charme. Symbole de créativité et d'expression personnelle, elle accompagne tous les styles avec caractère et authenticité.`;

    case 'Puma':
      return `La ${productName}${color ? ` coloris ${color}` : ''} représente l'innovation sportive de Puma. Cette sneaker combine performance technique et style urbain contemporain. Ses technologies d'amorti et matériaux techniques offrent confort et réactivité optimaux. Un design moderne qui s'adapte parfaitement au lifestyle actuel.`;

    case 'ASICS':
      return `La ${productName}${color ? ` en coloris ${color}` : ''} démontre l'expertise technique d'ASICS en matière de running. Cette sneaker intègre les technologies Gel et FlyteFoam pour un amorti et un confort exceptionnels. Son design fonctionnel et élégant allie performance sportive et style quotidien avec raffinement.`;

    default:
      return `La ${productName}${color ? ` coloris ${color}` : ''} est une sneaker de qualité premium qui combine style moderne et confort exceptionnel. Conçue avec des matériaux soigneusement sélectionnés, elle offre durabilité et élégance. Parfaite pour compléter votre garde-robe avec authenticité et caractère distinctif.`;
  }
}

function normalizeBrandName(brandName) {
  if (!brandName || brandName === 'Unknown') {
    return 'Nike';
  }

  const brand = brandName.toLowerCase();
  if (brand.includes('jordan')) {
    return 'Air Jordan';
  } else if (brand.includes('adidas')) {
    return 'Adidas';
  } else if (brand.includes('nike')) {
    return 'Nike';
  } else if (brand.includes('new balance')) {
    return 'New Balance';
  } else if (brand.includes('converse')) {
    return 'Converse';
  } else if (brand.includes('puma')) {
    return 'Puma';
  } else if (brand.includes('asics')) {
    return 'ASICS';
  }

  return brandName;
}

module.exports = {
  generateProductDescription,
  normalizeBrandName
};