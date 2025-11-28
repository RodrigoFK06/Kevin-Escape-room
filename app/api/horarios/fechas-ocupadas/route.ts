import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const salaId = searchParams.get("sala_id");

  if (!salaId) {
    return NextResponse.json(
      { error: "Falta el parámetro sala_id" },
      { status: 400 }
    );
  }

  try {
    // Buscar todos los horarios activos de esa sala
    const horarios = await prisma.horario.findMany({
      where: {
        sala_id: parseInt(salaId)
      },
      select: {
        id: true
      }
    });

    if (horarios.length === 0) {
      return NextResponse.json({ fechas_ocupadas: [] });
    }

    const horarioIds = horarios.map(h => h.id);

    // Buscar todas las fechas únicas que tengan reserva para esos horarios
    const reservas = await prisma.reserva.findMany({
      where: {
        horario_id: {
          in: horarioIds
        }
      },
      select: {
        fecha: true
      },
      distinct: ['fecha'],
      orderBy: {
        fecha: 'asc'
      }
    });

    const fechas = reservas.map(r => r.fecha.toISOString().split('T')[0]);

    return NextResponse.json({
      fechas_ocupadas: fechas
    });
  } catch (error) {
    console.error('Error al obtener fechas ocupadas:', error);
    return NextResponse.json(
      { error: 'Error al obtener las fechas ocupadas' },
      { status: 500 }
    );
  }
}
