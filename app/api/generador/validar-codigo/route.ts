import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Debe ser la misma clave secreta usada para generar
const SECRET_KEY = process.env.CODE_SECRET_KEY || 'ENCRYPTED_ESCAPE_ROOM_SECRET_2025_SUPER_SECURE';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codigo } = body;

    if (!codigo) {
      return NextResponse.json(
        { error: 'Código requerido', valido: false },
        { status: 400 }
      );
    }

    // Separar payload y firma
    const partes = codigo.split('.');
    if (partes.length !== 2) {
      return NextResponse.json(
        { error: 'Formato de código inválido', valido: false },
        { status: 400 }
      );
    }

    const [payloadBase64, signatureRecibida] = partes;

    // Decodificar el payload
    let payload: string;
    try {
      // Restaurar el Base64 URL-safe a Base64 normal
      const base64Normal = payloadBase64
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      // Añadir padding si es necesario
      const padding = '='.repeat((4 - (base64Normal.length % 4)) % 4);
      payload = Buffer.from(base64Normal + padding, 'base64').toString('utf-8');
    } catch (error) {
      return NextResponse.json(
        { error: 'Código corrupto o inválido', valido: false },
        { status: 400 }
      );
    }

    // Calcular la firma esperada
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(payload);
    const signatureEsperada = hmac.digest('hex').substring(0, 8);

    // Verificar firma
    if (signatureRecibida !== signatureEsperada) {
      return NextResponse.json(
        { 
          error: 'Código manipulado o inválido. La firma no coincide.', 
          valido: false 
        },
        { status: 400 }
      );
    }

    // Parsear el payload
    const partesDatos = payload.split('|');
    if (partesDatos.length !== 6) {
      return NextResponse.json(
        { error: 'Formato de datos inválido', valido: false },
        { status: 400 }
      );
    }

    const [equipoCodigo, salaId, puntaje, tiempo, integrantes, fecha] = partesDatos;

    // Validar que los datos sean números donde corresponda
    if (isNaN(Number(salaId)) || isNaN(Number(puntaje)) || isNaN(Number(tiempo)) || isNaN(Number(integrantes))) {
      return NextResponse.json(
        { error: 'Datos numéricos inválidos', valido: false },
        { status: 400 }
      );
    }

    // Código válido - devolver los datos decodificados
    return NextResponse.json({
      valido: true,
      datos: {
        equipoCodigo,
        salaId: parseInt(salaId),
        puntaje: parseInt(puntaje),
        tiempo: parseInt(tiempo),
        integrantes: parseInt(integrantes),
        fecha // Formato: DDMMYY
      }
    });
  } catch (error) {
    console.error('Error validando código:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', valido: false },
      { status: 500 }
    );
  }
}
