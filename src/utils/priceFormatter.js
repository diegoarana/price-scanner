/**
 * Formatea un precio para mostrar
 * - Muestra decimales solo si no son .00
 * - Mantiene el valor exacto sin redondeo
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '0';
  
  const numPrice = Number(price);
  
  // Si es un número entero, mostrar sin decimales
  if (Number.isInteger(numPrice)) {
    return numPrice.toString();
  }
  
  // Si tiene decimales, mostrarlos tal cual
  // Redondear solo visualmente a 2 decimales si tiene más
  const rounded = Math.round(numPrice * 100) / 100;
  
  // Si después de redondear es entero, mostrar sin decimales
  if (Number.isInteger(rounded)) {
    return rounded.toString();
  }
  
  // Mostrar con máximo 2 decimales
  return rounded.toString();
};

/**
 * Formatea un precio para el total (siempre con 2 decimales)
 */
export const formatTotal = (total) => {
  if (total === null || total === undefined) return '0.00';
  
  const numTotal = Number(total);
  return numTotal.toFixed(2);
};

/**
 * Formatea precio con separadores de miles (estilo argentino)
 */
export const formatPriceAR = (price) => {
  if (price === null || price === undefined) return '0';
  
  const numPrice = Number(price);
  const parts = numPrice.toFixed(2).split('.');
  
  // Agregar separador de miles
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Unir con coma decimal (formato argentino)
  return parts.join(',');
};

/**
 * Formatea total con separadores (estilo argentino)
 */
export const formatTotalAR = (total) => {
  if (total === null || total === undefined) return '0,00';
  
  const numTotal = Number(total);
  const parts = numTotal.toFixed(2).split('.');
  
  // Agregar separador de miles
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Unir con coma decimal
  return parts.join(',');
};