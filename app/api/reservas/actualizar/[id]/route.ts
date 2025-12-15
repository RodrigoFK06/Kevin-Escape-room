import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequiredFields } from "@/lib/utils-backend";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const reservaData = data.reserva;

    if (!reservaData) {
      return NextResponse.json(
        { error: 'Datos de reserva no proporcionados' },
        { status: 400 }
      );
    }

    const required = [
      'cliente',
      'correo',
      'telefono',
      'horario_id',
      'fecha',
      'cantidad_jugadores',
      'metodo_pago',
      'precio_total',
      'estado'
    ];

    const missingField = validateRequiredFields(reservaData, required);
    if (missingField) {
      return NextResponse.json(
        { error: `Falta el campo obligatorio: ${missingField}` },
        { status: 400 }
      );
    }

    // Obtener sala_id desde el horario
    const horario = await prisma.horario.findUnique({
      where: { id: parseInt(reservaData.horario_id) },
      select: { sala_id: true }
    });

    if (!horario) {
      return NextResponse.json(
        { error: 'Horario inválido' },
        { status: 400 }
      );
    }

    // Actualizar reserva
    // Convertir fecha a zona horaria local
    const fechaLocal = new Date(reservaData.fecha + 'T00:00:00');
    
    const reservaActualizada = await prisma.reserva.update({
      where: { id: parseInt(id) },
      data: {
        cliente: reservaData.cliente,
        correo: reservaData.correo,
        telefono: reservaData.telefono,
        sala_id: horario.sala_id,
        horario_id: parseInt(reservaData.horario_id),
        fecha: fechaLocal,
        cantidad_jugadores: parseInt(reservaData.cantidad_jugadores),
        metodo_pago: reservaData.metodo_pago,
        precio_total: parseFloat(reservaData.precio_total),
        estado: reservaData.estado
      }
    });

    return NextResponse.json({
      success: true,
      mensaje: 'Reserva actualizada vía API',
      data: reservaActualizada
    });
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la reserva' },
      { status: 500 }
    );
  }
}
