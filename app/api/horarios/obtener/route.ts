import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const horarios = await prisma.horario.findMany({
      include: {
        sala: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: [
        { sala_id: 'asc' },
        { hora: 'asc' }
      ]
    });

    // Formatear datos - Las horas se almacenan con timezone local (GMT-5)
    // Usamos getHours() para obtener la hora local correcta
    const formattedHorarios = horarios.map(h => {
      const horaDate = new Date(h.hora);
      const hours = horaDate.getHours().toString().padStart(2, '0');
      const minutes = horaDate.getMinutes().toString().padStart(2, '0');
      const seconds = horaDate.getSeconds().toString().padStart(2, '0');
      
      return {
        id: h.id,
        sala_id: h.sala_id,
        hora: `${hours}:${minutes}:${seconds}`,
        sala_nombre: h.sala.nombre
      };
    });

    return NextResponse.json({ data: formattedHorarios });
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los horarios' },
      { status: 500 }
    );
  }
}
