import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const equipoId = parseInt(id);

    // Verificar si el equipo existe
    const equipo = await prisma.equipo.findUnique({
      where: { id: equipoId },
      include: {
        rankings: true,
        integrantes: true
      }
    });

    if (!equipo) {
      return NextResponse.json(
        { error: "El equipo no existe" },
        { status: 404 }
      );
    }

    // Eliminar rankings asociados primero
    if (equipo.rankings.length > 0) {
      await prisma.ranking.deleteMany({
        where: { equipo_id: equipoId }
      });
    }

    // Eliminar integrantes (por la relación cascade)
    await prisma.integrante.deleteMany({
      where: { equipo_id: equipoId }
    });

    // Eliminar equipo
    await prisma.equipo.delete({
      where: { id: equipoId }
    });

    return NextResponse.json({
      success: true,
      mensaje: "Equipo y sus registros asociados eliminados exitosamente"
    });

  } catch (error: any) {
    console.error('Error al eliminar equipo:', error);
    return NextResponse.json(
      { error: "Error al eliminar el equipo", detalle: error.message },
      { status: 500 }
    );
  }
}
