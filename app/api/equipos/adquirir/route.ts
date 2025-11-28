import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Obtener el equipo más reciente
    const equipo = await prisma.equipo.findFirst({
      orderBy: {
        creado_en: 'desc'
      },
      select: {
        id: true,
        codigo: true,
        nombre: true
      }
    });

    if (!equipo) {
      return NextResponse.json(
        { error: 'No se encontró ningún equipo.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      equipo_id: equipo.id,
      codigo: equipo.codigo,
      nombre: equipo.nombre
    });
  } catch (error) {
    console.error('Error al obtener último código de equipo:', error);
    return NextResponse.json(
      { error: 'Error al obtener el código del equipo' },
      { status: 500 }
    );
  }
}
