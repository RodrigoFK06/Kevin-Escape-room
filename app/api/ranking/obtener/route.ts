import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rankings = await prisma.ranking.findMany({
      include: {
        equipo: {
          select: {
            id: true,
            nombre: true
          }
        },
        sala: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: {
        puntaje: 'desc'
      }
    });

    // Formatear datos para coincidir con formato PHP
    const formattedRankings = rankings.map(r => ({
      id: r.id,
      equipo_id: r.equipo_id,
      equipo_nombre: r.equipo.nombre,
      sala_id: r.sala_id,
      sala_nombre: r.sala.nombre,
      puntaje: parseFloat(r.puntaje.toString()),
      tiempo: r.tiempo,
      cantidad_integrantes: r.cantidad_integrantes,
      registrado_en: r.registrado_en.toISOString()
    }));

    return NextResponse.json(formattedRankings);
  } catch (error) {
    console.error('Error al obtener ranking:', error);
    // Devolver array vacío para mantener compatibilidad
    return NextResponse.json([]);
  }
}
