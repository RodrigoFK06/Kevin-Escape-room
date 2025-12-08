import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const estado = data.reserva?.activo;

    if (estado === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'Campo "activo" no proporcionado.'
        },
        { status: 400 }
      );
    }

    await prisma.reserva.update({
      where: { id: parseInt(id) },
      data: { activo: Boolean(estado) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al cambiar estado activo de reserva:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar el estado' },
      { status: 500 }
    );
  }
}
