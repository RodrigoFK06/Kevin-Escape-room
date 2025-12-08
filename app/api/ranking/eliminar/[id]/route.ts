import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.ranking.delete({
      where: { id: parseInt(id) }
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
