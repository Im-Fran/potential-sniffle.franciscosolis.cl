/**
 * Utilidades para validación y formateo de RUT chileno
 */

export function limpiarRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, '');
}

export function formatearRut(rut: string): string {
  const rutLimpio = limpiarRut(rut);
  if (rutLimpio.length < 2) return rutLimpio;

  const dv = rutLimpio.slice(-1);
  const numero = rutLimpio.slice(0, -1);

  // Formatear número con puntos
  const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${numeroFormateado}-${dv}`;
}

export function calcularDV(rut: string): string {
  const rutLimpio = limpiarRut(rut);
  const numero = rutLimpio.slice(0, -1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dv = 11 - resto;

  if (dv === 11) return '0';
  if (dv === 10) return 'K';
  return dv.toString();
}

export function validarRut(rut: string): boolean {
  const rutLimpio = limpiarRut(rut);

  if (rutLimpio.length < 2) return false;

  const dvIngresado = rutLimpio.slice(-1).toUpperCase();
  const dvCalculado = calcularDV(rut);

  return dvIngresado === dvCalculado;
}

export function validarFormatoRut(rut: string): boolean {
  const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
  return rutRegex.test(rut);
}

export function aplicarMascaraRut(valor: string): string {
  const rutLimpio = limpiarRut(valor);

  if (rutLimpio.length === 0) return '';
  if (rutLimpio.length === 1) return rutLimpio;

  // Limitar a 9 caracteres máximo (8 dígitos + 1 DV)
  const rutTruncado = rutLimpio.slice(0, 9);

  return formatearRut(rutTruncado);
}
