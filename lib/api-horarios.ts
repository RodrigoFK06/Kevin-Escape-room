import { API_BASE_URL } from "./config"

export async function fetchHorariosDisponibles(salaId: string, fecha: string) {
    try {
        const res = await fetch(
            `/api/horarios/disponibles?sala_id=${salaId}&fecha=${fecha}`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        )

        if (!res.ok) {
            throw new Error("No se pudo obtener los horarios disponibles")
        }

        const data = await res.json()
        return data // { horarios: [...], ocupados: [...] }
    } catch (error) {
        console.error("Error en fetchHorariosDisponibles:", error)
        return { horarios: [], ocupados: [] }
    }
}
