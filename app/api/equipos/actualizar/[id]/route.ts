import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, integrantes } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre del equipo es requerido" },
        { status: 400 }
      );
    }

    // Actualizar nombre del equipo
    const equipoActualizado = await prisma.equipo.update({
      where: { id: parseInt(id) },
      data: { nombre }
    });

    // Si se proporcionan integrantes, actualizar
    if (integrantes && Array.isArray(integrantes)) {
      // Eliminar integrantes existentes
      await prisma.integrante.deleteMany({
        where: { equipo_id: parseInt(id) }
      });

      // Crear nuevos integrantes
      if (integrantes.length > 0) {
        await prisma.integrante.createMany({
          data: integrantes.map((nombre: string) => ({
            nombre,
            equipo_id: parseInt(id)
          }))
        });
      }
    }

    // Obtener equipo actualizado con integrantes
    const equipoCompleto = await prisma.equipo.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        integrantes: true
      }
    });

    return NextResponse.json({
      success: true,
      mensaje: "Equipo actualizado exitosamente",
      equipo: equipoCompleto
    });

  } catch (error: any) {
    console.error('Error al actualizar equipo:', error);
    return NextResponse.json(
      { error: "Error al actualizar el equipo", detalle: error.message },
      { status: 500 }
    );
  }
}
