import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTeamCode } from "@/lib/utils-backend";

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Validaciones
    if (!json.nombre_equipo || json.nombre_equipo.trim() === '') {
      return NextResponse.json(
        { error: 'El nombre del equipo es obligatorio.' },
        { status: 400 }
      );
    }

    if (!json.integrantes || !Array.isArray(json.integrantes) || json.integrantes.length === 0) {
      return NextResponse.json(
        { error: 'Debe proporcionar al menos un integrante.' },
        { status: 400 }
      );
    }

    for (let i = 0; i < json.integrantes.length; i++) {
      const integrante = json.integrantes[i];
      if (!integrante.nombre || integrante.nombre.trim() === '') {
        return NextResponse.json(
          { error: `El nombre del integrante #${i + 1} es obligatorio.` },
          { status: 400 }
        );
      }
    }

    // Generar código único
    let codigo = generateTeamCode();
    
    // Verificar que el código sea único
    let equipoExistente = await prisma.equipo.findFirst({
      where: { codigo }
    });
    
    while (equipoExistente) {
      codigo = generateTeamCode();
      equipoExistente = await prisma.equipo.findFirst({
        where: { codigo }
      });
    }

    // Crear equipo e integrantes en una transacción
    const result = await prisma.$transaction(async (tx) => {
      const equipo = await tx.equipo.create({
        data: {
          nombre: json.nombre_equipo,
          codigo: codigo
        }
      });

      // Crear integrantes
      await tx.integrante.createMany({
        data: json.integrantes.map((i: any) => ({
          equipo_id: equipo.id,
          nombre: i.nombre
        }))
      });

      return equipo;
    });

    return NextResponse.json(
      {
        message: 'Equipo creado exitosamente.',
        codigo_equipo: codigo,
        equipo_id: result.id
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear equipo:', error);
    
    // Manejar error de nombre duplicado
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un equipo con ese nombre.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear el equipo' },
      { status: 500 }
    );
  }
}
