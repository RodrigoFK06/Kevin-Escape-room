import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const salaId = parseInt(id);

    // Verificar si hay reservas activas para esta sala
    const reservasActivas = await prisma.reserva.count({
      where: {
        sala_id: salaId,
        activo: true,
        fecha: {
          gte: new Date()
        }
      }
    });

    if (reservasActivas > 0) {
      return NextResponse.json(
        { 
          error: "No se puede eliminar la sala", 
          mensaje: `Hay ${reservasActivas} reserva(s) activa(s) para esta sala. Cancela las reservas primero.`
        },
        { status: 400 }
      );
    }

    await prisma.sala.delete({
      where: { id: salaId }
    });

    return NextResponse.json({
      success: true,
      mensaje: "Sala eliminada exitosamente"
    });

  } catch (error: any) {
    console.error('Error al eliminar sala:', error);
    return NextResponse.json(
      { error: "Error al eliminar la sala", detalle: error.message },
      { status: 500 }
    );
  }
}
