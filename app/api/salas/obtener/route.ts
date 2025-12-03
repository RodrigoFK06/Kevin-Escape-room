import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const salas = await prisma.sala.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    // Formatear datos
    const salasFormateadas = salas.map(s => ({
      ...s,
      rating: parseFloat(s.rating.toString())
    }));

    return NextResponse.json({ 
      success: true,
      data: salasFormateadas 
    });
  } catch (error) {
    console.error('Error al obtener salas:', error);
    return NextResponse.json(
      { error: 'Error al obtener las salas' },
      { status: 500 }
    );
  }
}
