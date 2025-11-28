import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    if (!data.equipo_id || !data.sala_id || !data.tiempo) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos.' },
        { status: 400 }
      );
    }

    const minutos = parseInt(data.tiempo);

    await prisma.ranking.update({
      where: { id: parseInt(params.id) },
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
      mensaje: 'Ranking actualizado vía API JSON.'
    });
  } catch (error) {
    console.error('Error al actualizar ranking:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el ranking' },
      { status: 500 }
    );
  }
}
