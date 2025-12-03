import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequiredFields } from "@/lib/utils-backend";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { sala } = body;

    if (!sala) {
      return NextResponse.json(
        { error: "Datos de sala requeridos" },
        { status: 400 }
      );
    }

    const salaActualizada = await prisma.sala.update({
      where: { id: parseInt(params.id) },
      data: {
        nombre: sala.nombre,
        descripcion: sala.descripcion,
        min_jugadores: parseInt(sala.min_jugadores),
        max_jugadores: parseInt(sala.max_jugadores),
        duracion: parseInt(sala.duracion),
        dificultad: sala.dificultad,
        rating: sala.rating ? parseFloat(sala.rating) : 0,
        tags: sala.tags || '',
        imagen: sala.imagen || '',
        destacado: sala.destacado || false
      }
    });

    return NextResponse.json({
      success: true,
      mensaje: "Sala actualizada exitosamente",
      sala: salaActualizada
    });

  } catch (error: any) {
    console.error('Error al actualizar sala:', error);
    return NextResponse.json(
      { error: "Error al actualizar la sala", detalle: error.message },
      { status: 500 }
    );
  }
}
