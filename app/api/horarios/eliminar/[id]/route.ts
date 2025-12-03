import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const horarioId = parseInt(params.id);

    // Verificar si hay reservas para este horario
    const reservas = await prisma.reserva.count({
      where: {
        horario_id: horarioId,
        fecha: {
          gte: new Date()
        }
      }
    });

    if (reservas > 0) {
      return NextResponse.json(
        { 
          error: "No se puede eliminar el horario", 
          mensaje: `Hay ${reservas} reserva(s) para este horario. Cancela o mueve las reservas primero.`
        },
        { status: 400 }
      );
    }

    await prisma.horario.delete({
      where: { id: horarioId }
    });

    return NextResponse.json({
      success: true,
      mensaje: "Horario eliminado exitosamente"
    });

  } catch (error: any) {
    console.error('Error al eliminar horario:', error);
    return NextResponse.json(
      { error: "Error al eliminar el horario", detalle: error.message },
      { status: 500 }
    );
  }
}
