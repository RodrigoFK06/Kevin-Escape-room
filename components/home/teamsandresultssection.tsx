"use client"

import { motion } from "framer-motion"
import { TeamRegistrationForm } from "@/components/home/team-registration-form"
import { ResultRegistrationForm } from "@/components/home/results-register"

export function TeamAndResultsSection() {
  return (
    <section className="py-16 md:py-24 bg-brand-dark relative w-full">
      {/* Fondo semitransparente, igual que en otras secciones */}
      <div className="absolute inset-0 bg-[url('/spookyback.jpg?height=800&width=1200')] bg-cover bg-center opacity-10 rounded-2xl"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Encabezado Principal de la Sección Unificada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-100 font-display">
            Módulo <span className="text-brand-gold">Unificado</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-2 text-lg md:text-xl font-sans">
            Registra nuevos equipos y registra los resultados finales tras cada experiencia,
            todo en un solo lugar.
          </p>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-6"></div>
        </motion.div>

        {/* Grid con 2 columnas: Registro de Equipos a la izquierda, Resultados a la derecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TeamRegistrationForm />
          <ResultRegistrationForm />
        </div>
      </div>
    </section>
  )
}
