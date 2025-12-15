import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const salaId = searchParams.get("sala_id");
  const fecha = searchParams.get("fecha");

  try {
    const whereClause: any = {};

    if (salaId) {
      whereClause.sala_id = parseInt(salaId);
    }

    if (fecha) {
      // Convertir fecha a zona horaria local para búsqueda correcta
      whereClause.fecha = new Date(fecha + 'T00:00:00');
    }

    const reservas = await prisma.reserva.findMany({
      where: whereClause,
      include: {
        horario: {
          select: {
            hora: true
          }
        },
        sala: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: {
        fecha: 'asc'
      }
    });

    // Formatear datos
    const formattedReservas = reservas.map(r => {
      // Extraer hora en formato HH:MM:SS desde el objeto Date de MySQL TIME
      const horaDate = new Date(r.horario.hora);
      const horaString = horaDate.toISOString().substring(11, 19);
      
      return {
        ...r,
        horario: {
          hora: horaString
        },
        sala: {
          nombre: r.sala.nombre
        },
        fecha: r.fecha.toISOString().split('T')[0],
        precio_total: parseFloat(r.precio_total.toString()),
        created_at: r.created_at.toISOString()
      };
    });

    return NextResponse.json({ data: formattedReservas });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    // Devolver array vacío para mantener compatibilidad
    return NextResponse.json({ data: [] });
  }
}
