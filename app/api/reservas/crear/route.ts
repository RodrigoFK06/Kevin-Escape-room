import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateRequiredFields } from "@/lib/utils-backend"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar campos requeridos
    const required = [
      'cliente',
      'correo',
      'telefono',
      'horario_id',
      'fecha',
      'cantidad_jugadores',
      'metodo_pago',
      'precio_total'
    ]

    const missingField = validateRequiredFields(body, required)
    if (missingField) {
      return NextResponse.json(
        { error: `Campo requerido faltante: ${missingField}` },
        { status: 400 }
      )
    }

    // Obtener sala_id desde el horario
    const horario = await prisma.horario.findUnique({
      where: { id: parseInt(body.horario_id) },
      select: { sala_id: true }
    })

    if (!horario) {
      return NextResponse.json(
        { error: 'Horario no encontrado' },
        { status: 404 }
      )
    }

    // Crear la reserva
    // Convertir fecha a objeto Date en zona horaria local (Perú UTC-5)
    // Agregamos 'T00:00:00' para forzar medianoche local, no UTC
    const fechaLocal = new Date(body.fecha + 'T00:00:00');
    
    const reserva = await prisma.reserva.create({
      data: {
        cliente: body.cliente,
        correo: body.correo,
        telefono: body.telefono,
        sala_id: horario.sala_id,
        horario_id: parseInt(body.horario_id),
        fecha: fechaLocal,
        cantidad_jugadores: parseInt(body.cantidad_jugadores),
        metodo_pago: body.metodo_pago,
        precio_total: parseFloat(body.precio_total),
        estado: body.estado || 'pendiente',
        activo: true
      }
    })

    return NextResponse.json({
      success: true,
      mensaje: 'Reserva creada exitosamente',
      data: {
        id: reserva.id,
        cliente: reserva.cliente,
        correo: reserva.correo,
        fecha: reserva.fecha.toISOString().split('T')[0],
        precio_total: parseFloat(reserva.precio_total.toString())
      }
    })

  } catch (error: any) {
    console.error("Error al crear reserva:", error)
    return NextResponse.json(
      { 
        error: "Error al crear la reserva",
        detalle: error.message 
      },
      { status: 500 }
    )
  }
}
