import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';

const SECRET_KEY = process.env.CODE_SECRET_KEY || 'ENCRYPTED_ESCAPE_ROOM_SECRET_2025_SUPER_SECURE';

export async function POST(request: Request) {
  try {
    const json = await request.json();

    if (!json.codigo_equipo || !json.codigo_resultado) {
      return NextResponse.json(
        { error: 'Debe proporcionar el código del equipo y el código de resultado.' },
        { status: 400 }
      );
    }

    const codigoEquipoIngresado = json.codigo_equipo.trim();
    const codigoResultado = json.codigo_resultado.trim();

    // ==========================================
    // PASO 1: Validar y decodificar el código
    // ==========================================
    
    // Separar payload y firma
    const partes = codigoResultado.split('.');
    if (partes.length !== 2) {
      return NextResponse.json(
        { error: 'Formato de código inválido.' },
        { status: 400 }
      );
    }

    const [payloadBase64, signatureRecibida] = partes;

    // Decodificar el payload
    let payload: string;
    try {
      const base64Normal = payloadBase64
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const padding = '='.repeat((4 - (base64Normal.length % 4)) % 4);
      payload = Buffer.from(base64Normal + padding, 'base64').toString('utf-8');
    } catch (error) {
      return NextResponse.json(
        { error: 'Código corrupto o inválido.' },
        { status: 400 }
      );
    }

    // Verificar firma HMAC
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(payload);
    const signatureEsperada = hmac.digest('hex').substring(0, 8);

    if (signatureRecibida !== signatureEsperada) {
      return NextResponse.json(
        { error: 'Código manipulado o inválido. Firma no coincide.' },
        { status: 400 }
      );
    }

    // Parsear datos del payload
    const partesDatos = payload.split('|');
    if (partesDatos.length !== 6) {
      return NextResponse.json(
        { error: 'Formato de datos inválido.' },
        { status: 400 }
      );
    }

    const [equipoCodigo, salaIdStr, puntajeStr, tiempoStr, integrantesStr, fecha] = partesDatos;

    // Validar que el código de equipo coincida
    if (equipoCodigo !== codigoEquipoIngresado) {
      return NextResponse.json(
        { error: 'El código de equipo no coincide con el código de resultado.' },
        { status: 400 }
      );
    }

    const salaId = parseInt(salaIdStr);
    const puntaje = parseInt(puntajeStr);
    const tiempo = parseInt(tiempoStr);
    const integrantes = parseInt(integrantesStr);

    // ==========================================
    // PASO 2: Buscar equipo en la base de datos
    // ==========================================
    
    const equipo = await prisma.equipo.findFirst({
      where: { codigo: codigoEquipoIngresado }
    });

    if (!equipo) {
      return NextResponse.json(
        { error: 'Equipo no encontrado.' },
        { status: 404 }
      );
    }

    // ==========================================
    // PASO 3: Registrar en ranking
    // ==========================================
    
    await prisma.ranking.create({
      data: {
        equipo_id: equipo.id,
        sala_id: salaId,
        tiempo: tiempo,
        puntaje: puntaje,
        cantidad_integrantes: integrantes
      }
    });

    return NextResponse.json(
      {
        message: 'Resultado registrado correctamente.',
        equipo: codigoEquipoIngresado,
        sala_id: salaId,
        puntaje: puntaje,
        tiempo: tiempo,
        integrantes: integrantes,
        fecha: fecha
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al registrar resultado:', error);
    
    // Manejar constraint unique de equipo_sala
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Este equipo ya tiene un resultado registrado para esta sala.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al registrar el resultado: ' + error.message },
      { status: 500 }
    );
  }
}
