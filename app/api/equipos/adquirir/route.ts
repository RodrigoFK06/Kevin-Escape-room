import { NextResponse } from "next/server"

// Maneja la solicitud OPTIONS para CORS (preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

// Maneja la solicitud GET y reenvía al endpoint externo
export async function GET(request: Request) {
  try {
    const res = await fetch("https://mediumorchid-grasshopper-668573.hostingersite.com/admin/equipos/ultimo-codigo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || "Error al obtener el último código")
    }

    const data = await res.json()

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (err: any) {
    console.error("Error en GET ultimo-codigo:", err)
    return NextResponse.json({ error: true, message: err.message }, { status: 500 })
  }
}
