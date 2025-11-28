import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Clave secreta para firmar los códigos (en producción, debe estar en variables de entorno)
const SECRET_KEY = process.env.CODE_SECRET_KEY || 'ENCRYPTED_ESCAPE_ROOM_SECRET_2025_SUPER_SECURE';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { equipoId, equipoCodigo, salaId, puntaje, tiempo, integrantes, fecha } = body;

    // Validar datos requeridos
    if (!equipoId || !equipoCodigo || !salaId || puntaje === undefined || !tiempo || !integrantes || !fecha) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Formatear fecha (DDMMYY)
    const fechaObj = new Date(fecha);
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const anio = String(fechaObj.getFullYear()).slice(-2);
    const fechaFormato = `${dia}${mes}${anio}`;

    // Crear el payload con los datos
    // Formato: equipoCodigo|salaId|puntaje|tiempo|integrantes|fecha
    const payload = `${equipoCodigo}|${salaId}|${puntaje}|${tiempo}|${integrantes}|${fechaFormato}`;

    // Generar firma HMAC SHA256
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(payload);
    const signature = hmac.digest('hex');

    // Tomar solo los primeros 8 caracteres de la firma
    const signatureShort = signature.substring(0, 8);

    // Codificar el payload en Base64 URL-safe
    const payloadBase64 = Buffer.from(payload)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Generar el código final: base64(payload).firma
    const codigoFinal = `${payloadBase64}.${signatureShort}`;

    // También guardamos un registro en la base de datos del código generado
    // (opcional pero recomendado para auditoría)
    
    return NextResponse.json({
      success: true,
      codigo: codigoFinal,
      detalles: {
        equipoCodigo,
        salaId,
        puntaje,
        tiempo,
        integrantes,
        fecha: fechaFormato
      }
    });
  } catch (error) {
    console.error('Error generando código:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
