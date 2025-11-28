/**
 * Genera un código alfanumérico aleatorio en mayúsculas
 * @param length - Longitud del código (por defecto entre 8 y 10)
 * @returns Código generado
 */
export function generateTeamCode(minLength: number = 8, maxLength: number = 10): string {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

/**
 * Encripta un valor numérico con prefijo y base64
 * @param value - Valor numérico a encriptar
 * @returns String encriptado
 */
export function encryptValue(value: number): string {
  const base64 = Buffer.from(value.toString()).toString('base64');
  return `XX${base64}`;
}

/**
 * Desencripta un valor encriptado (remueve prefijo XX y decodifica base64)
 * @param encrypted - String encriptado
 * @returns Valor numérico original o null si falla
 */
export function decryptValue(encrypted: string): number | null {
  try {
    // Remover prefijo "XX"
    const base64 = encrypted.substring(2);
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    const number = parseInt(decoded, 10);
    
    return isNaN(number) ? null : number;
  } catch (error) {
    return null;
  }
}

/**
 * Parsea un código de resultado con formato: "valor1" "valor2" "valor3"
 * @param resultCode - Código de resultado
 * @returns Array de valores desencriptados o null si falla
 */
export function parseResultCode(resultCode: string): { 
  minutos: number; 
  cantidadIntegrantes: number; 
  puntaje: number 
} | null {
  // Extraer valores entre comillas
  const matches = resultCode.match(/"([^"]+)"/g);
  
  if (!matches || matches.length !== 3) {
    return null;
  }
  
  // Remover comillas y desencriptar
  const values = matches.map(m => {
    const cleaned = m.replace(/"/g, '');
    return decryptValue(cleaned);
  });
  
  // Verificar que todos se desencriptaron correctamente
  if (values.some(v => v === null)) {
    return null;
  }
  
  return {
    minutos: values[0]!,
    cantidadIntegrantes: values[1]!,
    puntaje: values[2]!
  };
}

/**
 * Valida campos obligatorios en un objeto
 * @param data - Objeto a validar
 * @param requiredFields - Array de campos obligatorios
 * @returns Campo faltante o null si todo está bien
 */
export function validateRequiredFields(
  data: Record<string, any>, 
  requiredFields: string[]
): string | null {
  for (const field of requiredFields) {
    if (!data[field] || data[field] === '') {
      return field;
    }
  }
  return null;
}
