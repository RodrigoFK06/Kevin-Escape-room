import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const salaId = searchParams.get("sala_id")
  const fecha = searchParams.get("fecha")

  if (!salaId || !fecha) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 })
  }

  try {
    // Obtener todos los horarios activos de la sala
    const horarios = await prisma.horario.findMany({
      where: {
        sala_id: parseInt(salaId)
      },
      select: {
        id: true,
        hora: true
      }
    });

    // Formatear horas a HH:MM
    const horariosFormateados = horarios.map(h => ({
      id: h.id.toString(),
      hora: h.hora.toISOString().substring(11, 16) // HH:MM
    }));

    // Obtener IDs de horarios ya reservados ese día para esa sala
    // Convertir fecha a zona horaria local
    const fechaBusqueda = new Date(fecha + 'T00:00:00');
    
    const reservasOcupadas = await prisma.reserva.findMany({
      where: {
        fecha: fechaBusqueda,
        sala_id: parseInt(salaId)
      },
      select: {
        horario_id: true
      }
    });

    const ocupados = reservasOcupadas.map(r => r.horario_id.toString());

    return NextResponse.json({
      horarios: horariosFormateados,
      ocupados: ocupados
    })
  } catch (error) {
    console.error("Error al obtener horarios disponibles:", error)
    return NextResponse.json({ error: "Fallo al obtener los horarios" }, { status: 500 })
  }
}
