import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const equipoId = parseInt(params.id);

    // Verificar si hay rankings para este equipo
    const rankings = await prisma.ranking.count({
      where: { equipo_id: equipoId }
    });

    if (rankings > 0) {
      return NextResponse.json(
        { 
          error: "No se puede eliminar el equipo", 
          mensaje: `El equipo tiene ${rankings} registro(s) en el ranking. Elimina los registros del ranking primero.`
        },
        { status: 400 }
      );
    }

    // Eliminar integrantes primero (por la relación)
    await prisma.integrante.deleteMany({
      where: { equipo_id: equipoId }
    });

    // Eliminar equipo
    await prisma.equipo.delete({
      where: { id: equipoId }
    });

    return NextResponse.json({
      success: true,
      mensaje: "Equipo eliminado exitosamente"
    });

  } catch (error: any) {
    console.error('Error al eliminar equipo:', error);
    return NextResponse.json(
      { error: "Error al eliminar el equipo", detalle: error.message },
      { status: 500 }
    );
  }
}
