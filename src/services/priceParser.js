/**
 * Extrae precios del texto reconocido por OCR
 * Soporta formatos argentinos: $1.234,56 o 1234,56 o $1234
 */
export const extractPrices = (text) => {
  if (!text) return [];

  // Patrones de precios comunes en Argentina
  const patterns = [
    // $1.234,56 o $1234,56
    /\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})/g,
    // $1234 o $1.234
    /\$\s*(\d{1,3}(?:\.\d{3})*)/g,
    // 1.234,56 o 1234,56 (sin símbolo $)
    /(\d{1,3}(?:\.\d{3})*,\d{2})/g,
    // Formato simple: 1234 o 123
    /\b(\d{2,5})\b/g
  ];

  const foundPrices = [];
  const seenPrices = new Set();

  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const priceStr = match[1] || match[0];
      const normalizedPrice = normalizePrice(priceStr);
      
      if (normalizedPrice && !seenPrices.has(normalizedPrice)) {
        seenPrices.add(normalizedPrice);
        foundPrices.push({
          raw: match[0],
          value: normalizedPrice,
          position: match.index
        });
      }
    }
  }

  // Ordenar por posición en el texto
  return foundPrices.sort((a, b) => a.position - b.position);
};

/**
 * Normaliza un string de precio a número
 * Convierte formatos argentinos a número float
 */
export const normalizePrice = (priceStr) => {
  if (!priceStr) return null;

  // Remover símbolo $ y espacios
  let cleaned = priceStr.replace(/[$\s]/g, '');
  
  // Manejar formato argentino: 1.234,56 -> 1234.56
  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  }

  const price = parseFloat(cleaned);
  
  // Validar que sea un precio razonable (entre 1 y 999999)
  if (isNaN(price) || price < 1 || price > 999999) {
    return null;
  }

  return price;
};

/**
 * Encuentra el precio más probable en el texto
 * Heurística: el primer precio encontrado, o el más grande si hay varios
 */
export const findMostLikelyPrice = (text) => {
  const prices = extractPrices(text);
  
  if (prices.length === 0) return null;
  if (prices.length === 1) return prices[0].value;
  
  // Si hay múltiples precios, devolver el más grande
  // (usualmente el precio total es el más prominente)
  return Math.max(...prices.map(p => p.value));
};