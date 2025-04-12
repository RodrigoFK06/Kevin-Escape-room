import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Extrae el body enviado desde el cliente
    const { codigo_equipo, codigo_resultado, sala_id } = await request.json()

    // Realiza la llamada al endpoint real en producción
    const res = await fetch("https://mediumorchid-grasshopper-668573.hostingersite.com/admin/ranking/registrar-resultado", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo_equipo,
        codigo_resultado,
        sala_id,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || "Error en el API de registrar resultado")
    }

    const data = await res.json()

    // Se retorna la respuesta del endpoint real, incluyendo la cabecera CORS
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (err: any) {
    console.error("Error registrando resultado:", err)
    return NextResponse.json({ error: true, message: err.message }, { status: 500 })
  }
}
