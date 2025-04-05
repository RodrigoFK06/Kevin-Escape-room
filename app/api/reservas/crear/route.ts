import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    // 1. Obtenemos el body que envía el frontend
    const body = await request.json()

    // 2. Hacemos POST a la URL externa con ese body
    const res = await fetch(`${API_BASE_URL}/admin/reservas/crear`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error al crear la reserva en el backend" },
        { status: 500 }
      )
    }

    // 3. Retornamos la respuesta JSON al frontend
    const data = await res.json()
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error("Error en /api/reservas/crear proxy:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
