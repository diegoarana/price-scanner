/**
 * Limpia y normaliza el texto OCR
 */
const cleanOCRText = (text) => {
  if (!text) return '';
  
  // Remover saltos de línea y espacios extras
  let cleaned = text.replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Corregir errores comunes de OCR
  cleaned = cleaned
    .replace(/[oO]/g, '0')  // O mayúscula o minúscula por 0
    .replace(/[lI|]/g, '1') // l, I, | por 1
    .replace(/[Ss§]/g, '5') // S por 5
    .replace(/[B]/g, '8')   // B por 8
    .replace(/[Z]/g, '2');  // Z por 2
  
  return cleaned;
};

/**
 * Extrae precios del texto reconocido por OCR
 * Soporta formatos argentinos: $1.234,56 o 1234,56 o $1234
 */
export const extractPrices = (text) => {
  if (!text) return [];

  const cleaned = cleanOCRText(text);
  console.log('Texto limpio:', cleaned);

  // Patrones de precios comunes en Argentina (ordenados por especificidad)
  const patterns = [
    // $1.234,56 o $1234,56 (con símbolo y decimales)
    /\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})/g,
    // 1.234,56 o 1234,56 (sin símbolo, con decimales)
    /(?<!\d)(\d{1,3}(?:\.\d{3})*,\d{2})(?!\d)/g,
    // $1.234 o $1234 (con símbolo, sin decimales)
    /\$\s*(\d{1,3}(?:\.\d{3})+)(?!\d)/g,
    // 1.234 o 3.429 (sin símbolo, con punto como separador de miles)
    /(?<!\d)(\d{1,3}\.\d{3})(?!\d)/g,
    // $123 o $12 (con símbolo, números pequeños)
    /\$\s*(\d{2,4})(?!\d)/g,
    // 1234 o 123 (solo números, 2-4 dígitos)
    /(?<!\d)(\d{2,4})(?!\d)/g,
  ];

  const foundPrices = [];
  const seenPrices = new Set();

  for (const pattern of patterns) {
    const matches = cleaned.matchAll(pattern);
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
  
  // Si no tiene ningún separador, es un número simple
  if (!cleaned.includes('.') && !cleaned.includes(',')) {
    const price = parseFloat(cleaned);
    if (!isNaN(price) && price >= 1 && price <= 999999) {
      return price;
    }
    return null;
  }
  
  // Manejar formato argentino: 1.234,56 -> 1234.56
  if (cleaned.includes(',')) {
    // Remover puntos (separadores de miles) y reemplazar coma por punto
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes('.')) {
    // Si tiene punto, determinar si es separador de miles o decimal
    const parts = cleaned.split('.');
    
    if (parts.length === 2) {
      const decimals = parts[1];
      
      // Si la parte decimal tiene 3 dígitos, es separador de miles (ej: 3.429)
      // Si tiene 1-2 dígitos, es separador decimal (ej: 3.50)
      if (decimals.length === 3) {
        // Es separador de miles, removerlo
        cleaned = cleaned.replace('.', '');
      }
      // Si tiene 2 dígitos o menos, dejarlo como decimal
    } else if (parts.length > 2) {
      // Múltiples puntos = separadores de miles
      cleaned = cleaned.replace(/\./g, '');
    }
  }

  const price = parseFloat(cleaned);
  
  // Validar que sea un precio razonable (entre $1 y $999.999)
  if (isNaN(price) || price < 1 || price > 999999) {
    return null;
  }

  return price;
};

/**
 * Encuentra el precio más probable en el texto
 * Heurística: el primer precio válido, o el más grande si hay varios pequeños
 */
export const findMostLikelyPrice = (text) => {
  const prices = extractPrices(text);
  
  console.log('Precios encontrados:', prices);
  
  if (prices.length === 0) return null;
  if (prices.length === 1) return prices[0].value;
  
  // Si hay múltiples precios, elegir el más grande (usualmente es el precio total/destacado)
  // pero ignorar precios muy grandes que probablemente son errores
  const validPrices = prices.filter(p => p.value < 100000);
  
  if (validPrices.length === 0) return prices[0].value;
  
  return Math.max(...validPrices.map(p => p.value));
};

/**
 * Valida si un precio parece razonable
 */
export const isValidPrice = (price, minPrice = 1, maxPrice = 50000) => {
  return price >= minPrice && price <= maxPrice;
};

export const getAllValidPrices = (text) => {
  const prices = extractPrices(text);
  
  // Filtrar por rango personalizado
  const validPrices = prices
    .filter(p => p.value >= 10 && p.value < 50000) // Tu rango
    .map(p => p.value)
    .sort((a, b) => b - a);
  
  return [...new Set(validPrices)];
};