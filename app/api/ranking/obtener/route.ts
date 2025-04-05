import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("https://mediumorchid-grasshopper-668573.hostingersite.com/admin/ranking/obtener", {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Cookie": "ci_session=3137924a68e6b3482f69b324ffa72f44", // ⚠️ REEMPLAZAR si expira
      },
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("API externa falló:", res.status, res.statusText)
      return NextResponse.json({ error: true, message: "Fallo en la API externa" }, { status: 500 })
    }

    const json = await res.json()
    return NextResponse.json(json.data || [], { status: 200 })

  } catch (err: any) {
    console.error("Error en proxy API:", err.message)
    return NextResponse.json({ error: true, message: err.message }, { status: 500 })
  }
}
