import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequiredFields } from "@/lib/utils-backend";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.equipo_id || !data.sala_id || !data.tiempo || !data.fecha) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: equipo_id, sala_id, tiempo, fecha.' },
        { status: 400 }
      );
    }

    const minutos = parseInt(data.tiempo);

    const ranking = await prisma.ranking.create({
      data: {
        equipo_id: parseInt(data.equipo_id),
        sala_id: parseInt(data.sala_id),
        tiempo: minutos,
        puntaje: parseFloat(data.puntaje || 0),
        cantidad_integrantes: data.cantidad_integrantes ? parseInt(data.cantidad_integrantes) : null
      }
    });

    return NextResponse.json({
      success: true,
      mensaje: 'Ranking registrado correctamente.',
      equipo_id: data.equipo_id
    });
  } catch (error: any) {
    console.error('Error al crear ranking:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Este equipo ya tiene un ranking registrado para esta sala.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear el ranking' },
      { status: 500 }
    );
  }
}
