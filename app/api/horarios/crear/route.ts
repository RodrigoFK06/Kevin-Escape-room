import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sala_id, hora } = body;

    if (!sala_id || !hora) {
      return NextResponse.json(
        { error: "sala_id y hora son requeridos" },
        { status: 400 }
      );
    }

    // Convertir hora string (HH:MM) a Date UTC
    const [hours, minutes] = hora.split(':').map(Number);
    const horaDate = new Date(Date.UTC(2000, 0, 1, hours, minutes, 0));

    const nuevoHorario = await prisma.horario.create({
      data: {
        sala_id: parseInt(sala_id),
        hora: horaDate
      }
    });

    return NextResponse.json({
      success: true,
      mensaje: "Horario creado exitosamente",
      horario: {
        id: nuevoHorario.id,
        sala_id: nuevoHorario.sala_id,
        hora: nuevoHorario.hora.toISOString().substring(11, 16)
      }
    });

  } catch (error: any) {
    console.error('Error al crear horario:', error);
    return NextResponse.json(
      { error: "Error al crear el horario", detalle: error.message },
      { status: 500 }
    );
  }
}
