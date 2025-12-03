import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequiredFields } from "@/lib/utils-backend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sala } = body;

    if (!sala) {
      return NextResponse.json(
        { error: "Datos de sala requeridos" },
        { status: 400 }
      );
    }

    const required = [
      'nombre',
      'descripcion',
      'min_jugadores',
      'max_jugadores',
      'duracion',
      'dificultad'
    ];

    const missingField = validateRequiredFields(sala, required);
    if (missingField) {
      return NextResponse.json(
        { error: `Campo requerido: ${missingField}` },
        { status: 400 }
      );
    }

    const nuevaSala = await prisma.sala.create({
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
      mensaje: "Sala creada exitosamente",
      sala: nuevaSala
    });

  } catch (error: any) {
    console.error('Error al crear sala:', error);
    return NextResponse.json(
      { error: "Error al crear la sala", detalle: error.message },
      { status: 500 }
    );
  }
}
