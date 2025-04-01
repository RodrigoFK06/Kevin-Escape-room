import { API_BASE_URL } from "./config";

export async function fetchRanking() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/ranking/obtener`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`Error al obtener ranking: ${res.statusText}`);
    }

    const data = await res.json();
    return data; // Puede ser { data: [...] } o simplemente un array según tu backend
  } catch (error) {
    console.error("Error al obtener el ranking:", error);
    return { error: true, message: (error as Error).message };
  }
}
