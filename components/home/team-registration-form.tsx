"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { User2, Users, AlertCircle } from "lucide-react"

export function TeamRegistrationForm() {
  const [teamName, setTeamName] = useState("")
  const [memberCount, setMemberCount] = useState(1)
  const [members, setMembers] = useState<string[]>([""])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  // Estado para el modal y el código obtenido
  const [showModal, setShowModal] = useState(false)
  const [teamCode, setTeamCode] = useState("")

  const handleMemberCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = Number(e.target.value)
    setMemberCount(count)
    setMembers((prev) => {
      if (count > prev.length) {
        return [...prev, ...Array(count - prev.length).fill("")]
      } else {
        return prev.slice(0, count)
      }
    })
  }

  const handleMemberNameChange = (index: number, value: string) => {
    setMembers((prev) => {
      const newMembers = [...prev]
      newMembers[index] = value
      return newMembers
    })
  }

  // Función para obtener el código del equipo usando nuestro endpoint proxy interno
  const fetchTeamCode = async () => {
    try {
      const res = await fetch("/api/equipos/adquirir", { method: "GET" })
      if (!res.ok) {
        throw new Error("No se pudo obtener el código de equipo")
      }
      const data = await res.json()
      return data.codigo || ""
    } catch (error: any) {
      console.error("Error al obtener el código de equipo:", error)
      return ""
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const payload = {
      nombre_equipo: teamName,
      integrantes: members
        .filter((name) => name.trim() !== "")
        .map((name) => ({ nombre: name })),
    }

    try {
      const res = await fetch("/api/equipos/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || "Error al enviar los datos")
      }

      // Resetea el formulario
      setTeamName("")
      setMemberCount(1)
      setMembers([""])
      setMessage("Equipo registrado exitosamente.")

      // Obtiene el código mediante nuestro API interno
      const codigo = await fetchTeamCode()
      setTeamCode(codigo)
      // Muestra el modal con el código
      setShowModal(true)
    } catch (error: any) {
      setMessage("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          
          <div className="bg-[#0a141f]/95 border border-yellow-500 rounded-lg p-8 max-w-md mx-4 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-100 font-display">
              ¡Atención!
            </h3>
            <p className="text-lg md:text-xl text-brand-gold font-semibold mb-4">
              ESTE ES TU CÓDIGO DE EQUIPO
            </p>
            <p className="text-gray-100 mb-6">
              Anótalo, porque lo necesitarás luego para acceder a otras funcionalidades.
            </p>
            <div className="bg-gray-900 py-2 px-4 rounded mb-6 border border-brand-gold/30">
              <span className="text-xl font-mono text-gray-100">{teamCode}</span>
            </div>
            <Button
              onClick={() => setShowModal(false)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background h-10 px-4 py-2 w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark horror-button"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}

      <div className="bg-brand-blue/80 border border-brand-gold/20 rounded-lg p-6 md:p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-100 font-display">
            Registro de <span className="text-brand-gold">Equipos</span>
          </h3>
          <p className="text-sm md:text-base text-gray-400 font-sans">
            Ingresa los datos de tu equipo para participar en la competencia.
          </p>
          <div className="w-16 h-1 bg-brand-gold mt-2"></div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre del Equipo */}
          <div>
            <label
              htmlFor="teamName"
              className="block text-base md:text-lg font-medium flex items-center text-gray-300 font-sans mb-1"
            >
              <User2 className="mr-2 h-5 w-5 text-brand-gold" />
              Nombre del Equipo
            </label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full rounded-md border border-brand-gold/30 bg-[#0a141f] text-gray-100 px-3 py-2 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
              placeholder="Ej. Los Estrategas"
              required
            />
          </div>

          {/* Selector de Cantidad de Integrantes */}
          <div>
            <label
              htmlFor="memberCount"
              className="block text-base md:text-lg font-medium flex items-center text-gray-300 font-sans mb-1"
            >
              <Users className="mr-2 h-5 w-5 text-brand-gold" />
              Cantidad de Integrantes
            </label>
            <select
              id="memberCount"
              value={memberCount}
              onChange={handleMemberCountChange}
              className="w-full rounded-md border border-brand-gold/30 bg-[#0a141f] text-gray-100 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Integrantes dinámicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {members.map((member, index) => (
              <div key={index}>
                <label
                  htmlFor={`member-${index}`}
                  className="block text-base md:text-lg font-medium flex items-center text-gray-300 font-sans mb-1"
                >
                  <User2 className="mr-2 h-4 w-4 text-brand-gold" />
                  Integrante {index + 1}
                </label>
                <input
                  id={`member-${index}`}
                  type="text"
                  value={member}
                  onChange={(e) => handleMemberNameChange(index, e.target.value)}
                  className="w-full rounded-md border border-brand-gold/30 bg-[#0a141f] text-gray-100 px-3 py-2 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="Ej. Daniel Gómez"
                  required
                />
              </div>
            ))}
          </div>

          {/* Botón de Envío */}
          <div className="text-center pt-3">
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
                <>Registrar Equipo</>
              )}
            </Button>
          </div>

          {/* Mensajes de confirmación o error */}
          {message && (
            <div className="text-center mt-4 text-gray-200 text-sm md:text-base font-medium flex items-center justify-center gap-2">
              {message.includes("Error") && <AlertCircle className="h-5 w-5 text-red-500" />}
              <span>{message}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
