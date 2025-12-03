import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.ranking.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({
      success: true,
      mensaje: "Registro de ranking eliminado exitosamente"
    });

  } catch (error: any) {
    console.error('Error al eliminar ranking:', error);
    return NextResponse.json(
      { error: "Error al eliminar el ranking", detalle: error.message },
      { status: 500 }
    );
  }
}
