import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const equipos = await prisma.equipo.findMany({
      include: {
        integrantes: {
          select: {
            id: true,
            nombre: true
          }
        }
      },
      orderBy: {
        creado_en: 'desc'
      }
    });

    return NextResponse.json(equipos);
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    // En caso de error, devolver array vacío con status 200
    // para mantener compatibilidad con el frontend
    return NextResponse.json([]);
  }
}
