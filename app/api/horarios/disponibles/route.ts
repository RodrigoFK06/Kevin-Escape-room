import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/config"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const salaId = searchParams.get("sala_id")
  const fecha = searchParams.get("fecha")

  if (!salaId || !fecha) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 })
  }

  try {
    const res = await fetch(`${API_BASE_URL}/admin/horarios/disponibles?sala_id=${salaId}&fecha=${fecha}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Error al obtener horarios")
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en proxy de horarios disponibles:", error)
    return NextResponse.json({ error: "Fallo al obtener los horarios" }, { status: 500 })
  }
}
