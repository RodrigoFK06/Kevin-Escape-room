"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Key, AlertCircle, Lock } from "lucide-react"

export function ResultRegistrationForm() {
  const [codigoEquipo, setCodigoEquipo] = useState("")
  const [codigoResultado, setCodigoResultado] = useState("")
  const [salaId, setSalaId] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const payload = {
      codigo_equipo: codigoEquipo.trim(),
      codigo_resultado: codigoResultado.trim(),
      sala_id: salaId ? Number(salaId) : undefined,
    }

    try {
      const res = await fetch("/api/equipos/registrar-resultado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || "Error al enviar los resultados")
      }

      setMessage("Resultado registrado correctamente.")
      setCodigoEquipo("")
      setCodigoResultado("")
      setSalaId("")
    } catch (error: any) {
      setMessage("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-brand-blue/80 border border-brand-gold/20 rounded-lg p-6 md:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-100 font-display">
          Registrar <span className="text-brand-gold">Resultados</span>
        </h3>
        <p className="text-sm md:text-base text-gray-400 font-sans">
          Tras la experiencia ingresa los siguientes datos.
        </p>
        <div className="w-16 h-1 bg-brand-gold mt-2"></div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Código del Equipo */}
        <div>
          <label
            htmlFor="codigoEquipo"
            className="block text-base md:text-lg font-medium text-gray-300 font-sans mb-1"
          >
            Código de Equipo
          </label>
          <input
            id="codigoEquipo"
            type="text"
            value={codigoEquipo}
            onChange={(e) => setCodigoEquipo(e.target.value)}
            className="w-full rounded-md border border-brand-gold/30 bg-[#0a141f] text-gray-100 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
            placeholder="Ej. EQP-8F2KZ3"
            required
          />
        </div>

        {/* Código de Resultado */}
        <div>
          <label
            htmlFor="codigoResultado"
            className="block text-base md:text-lg font-medium text-gray-300 font-sans mb-1"
          >
            Código de Resultado
          </label>
          <input
            id="codigoResultado"
            type="text"
            value={codigoResultado}
            onChange={(e) => setCodigoResultado(e.target.value)}
            className="w-full rounded-md border border-brand-gold/30 bg-[#0a141f] text-gray-100 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
            placeholder='Ej. #XGf"50"@cR"5"Z*"1000"&Q'
            required
          />
        </div>

        {/* Sala ID (Opcional) */}
        <div>
          <label
            htmlFor="salaId"
            className="block text-base md:text-lg font-medium text-gray-300 font-sans mb-1"
          >
            Sala ID (opcional)
          </label>
          <input
            id="salaId"
            type="number"
            min={1}
            value={salaId}
            onChange={(e) => setSalaId(e.target.value)}
            className="w-full rounded-md border border-brand-gold/30 bg-[#0a141f] text-gray-100 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
            placeholder="Ej. 1"
          />
        </div>

        {/* Botón Enviar con efecto horror-button */}
        <div className="text-center pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background h-10 px-4 py-2 w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark horror-button"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-brand-dark border-t-transparent"></div>
                Enviando...
              </>
            ) : (
              <>
                <span className="mr-2">Registrar Resultado</span>
                <Lock className="h-4 w-4 group-hover:hidden" />
                <Key className="h-4 w-4 hidden group-hover:block animate-key-turn" />
              </>
            )}
          </Button>
        </div>

        {message && (
          <div className="text-center mt-4 text-gray-200 text-sm md:text-base font-medium flex items-center justify-center gap-2">
            {message.includes("Error") && <AlertCircle className="h-5 w-5 text-red-500" />}
            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  )
}
