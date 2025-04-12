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

  // Selector para la cantidad de integrantes
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

  // Actualiza el nombre de cada integrante
  const handleMemberNameChange = (index: number, value: string) => {
    setMembers((prev) => {
      const newMembers = [...prev]
      newMembers[index] = value
      return newMembers
    })
  }

  // Envía la información al endpoint interno (proxy)
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

      setMessage("Equipo registrado exitosamente.")
      setTeamName("")
      setMemberCount(1)
      setMembers([""])
    } catch (error: any) {
      setMessage("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-brand-blue/80 border border-brand-gold/20 rounded-lg p-6 md:p-8 space-y-6">
      {/* Encabezado */}
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

      {/* Formulario */}
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
            className="group font-sans h-11 border-brand-gold/30 hover:border-brand-gold/50 hover:bg-brand-gold/10 text-gray-300 transition-colors flex items-center justify-center px-6 w-full md:w-auto"
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
  )
}
