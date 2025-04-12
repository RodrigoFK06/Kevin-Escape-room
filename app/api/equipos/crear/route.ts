import { NextResponse } from "next/server"

// Respuesta para la solicitud OPTIONS (preflight CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function POST(request: Request) {
  try {
    // Recibe el body del cliente
    const body = await request.json()

    // Se reenvía la petición al endpoint externo
    const res = await fetch("https://mediumorchid-grasshopper-668573.hostingersite.com/admin/equipos/crear", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        // ⚠️ REEMPLAZAR si expira la cookie
        "Cookie": "ci_session=3137924a68e6b3482f69b324ffa72f44",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.error("API externa falló:", res.status, res.statusText)
      return NextResponse.json(
        { error: true, message: "Fallo en la API externa" },
        { status: res.status }
      )
    }

    const json = await res.json()

    // Se agrega la cabecera CORS en la respuesta para el cliente
    return new NextResponse(JSON.stringify(json), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (err: any) {
    console.error("Error en proxy API:", err.message)
    return NextResponse.json(
      { error: true, message: err.message },
      { status: 500 }
    )
  }
}
