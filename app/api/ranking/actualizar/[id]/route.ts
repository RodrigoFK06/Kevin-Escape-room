import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const { id } = await params;
    const rankingId = parseInt(id);

    // Validar que se envíen los campos requeridos
    if (data.puntaje === undefined || data.tiempo === undefined || data.cantidad_integrantes === undefined) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos (puntaje, tiempo, cantidad_integrantes)' },
        { status: 400 }
      );
    }

    // Actualizar solo los campos editables
    const updated = await prisma.ranking.update({
      where: { id: rankingId },
      data: {
        puntaje: parseFloat(data.puntaje),
        tiempo: parseInt(data.tiempo),
        cantidad_integrantes: parseInt(data.cantidad_integrantes)
      }
    });

    return NextResponse.json({
      success: true,
      mensaje: 'Ranking actualizado correctamente',
      data: updated
    });
  } catch (error: any) {
    console.error('Error al actualizar ranking:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el ranking', detalle: error.message },
      { status: 500 }
    );
  }
}
