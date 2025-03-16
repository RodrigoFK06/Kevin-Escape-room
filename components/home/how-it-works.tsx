"use client"

import { Users, Search, Clock, Key, Brain, DoorOpen } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function HowItWorks() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  const steps = [
    {
      icon: <Users className="h-10 w-10 md:h-12 md:w-12 text-brand-gold" />,
      title: "Forma tu equipo",
      description: "De 2 a 6 jugadores para enfrentar el desafío juntos.",
      delay: 0.1,
      bg: "bg-[url('/placeholder.svg?height=200&width=200')]",
    },
    {
      icon: <Brain className="h-10 w-10 md:h-12 md:w-12 text-brand-gold" />,
      title: "Resuelve enigmas",
      description: "Usa tu ingenio para descifrar acertijos y encontrar pistas ocultas.",
      delay: 0.2,
      bg: "bg-[url('/placeholder.svg?height=200&width=200')]",
    },
    {
      icon: <Search className="h-10 w-10 md:h-12 md:w-12 text-brand-gold" />,
      title: "Descubre secretos",
      description: "Investiga cada rincón y revela los misterios encriptados.",
      delay: 0.3,
      bg: "bg-[url('/placeholder.svg?height=200&width=200')]",
    },
    {
      icon: <Key className="h-10 w-10 md:h-12 md:w-12 text-brand-gold" />,
      title: "Encuentra las llaves",
      description: "Localiza las llaves físicas y mentales que te permitirán avanzar.",
      delay: 0.4,
      bg: "bg-[url('/placeholder.svg?height=200&width=200')]",
    },
    {
      icon: <Clock className="h-10 w-10 md:h-12 md:w-12 text-brand-gold" />,
      title: "Contra el tiempo",
      description: "Solo tienes 60 minutos antes de que sea demasiado tarde.",
      delay: 0.5,
      bg: "bg-[url('/placeholder.svg?height=200&width=200')]",
    },
    {
      icon: <DoorOpen className="h-10 w-10 md:h-12 md:w-12 text-brand-gold" />,
      title: "Escapa o quédate",
      description: "Encuentra la salida o conviértete en parte de la historia encriptada.",
      delay: 0.6,
      bg: "bg-[url('/placeholder.svg?height=200&width=200')]",
    },
  ]

  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-brand-dark relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-5 rounded-3xl"></div>


      {/* Línea de tiempo vertical */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-brand-gold/30 to-transparent transform -translate-x-1/2 hidden md:block"></div>

      <motion.div ref={containerRef} style={{ opacity, scale }} className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-display">
            ¿CÓMO <span className="text-brand-gold">FUNCIONA</span>?
          </h2>
          <div className="w-20 h-1 bg-brand-gold mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: step.delay }}
              className={`relative ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}
            >
              {/* Conector para desktop */}
              <div
                className={`absolute top-10 ${index % 2 === 0 ? "right-0" : "left-0"} w-12 h-0.5 bg-brand-gold/50 hidden md:block`}
              ></div>

              {/* Punto para desktop */}
              <div
                className={`absolute top-10 ${index % 2 === 0 ? "right-0" : "left-0"} w-4 h-4 rounded-full bg-brand-gold transform translate-x-${index % 2 === 0 ? "1/2" : "-1/2"} -translate-y-1/2 hidden md:block`}
              ></div>

              <div className="bg-[#0a141f]/50 border border-brand-gold/20 rounded-lg p-6 hover:border-brand-gold/50 transition-all duration-300">
                <div className={`flex ${index % 2 === 0 ? "md:justify-end" : ""} mb-4`}>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-brand-gold/20 rounded-full blur-sm"></div>
                    <div className="relative bg-brand-dark p-3 md:p-4 rounded-full">{step.icon}</div>
                  </div>
                </div>

                <h3
                  className={`text-xl md:text-2xl font-bold mb-3 font-display ${index % 2 === 0 ? "md:text-right" : ""}`}
                >
                  {step.title}
                </h3>

                <p className={`text-gray-400 text-sm md:text-base font-sans ${index % 2 === 0 ? "md:text-right" : ""}`}>
                  {step.description}
                </p>

                {/* Número de paso */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Llamada a la acción */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-brand-dark/80 backdrop-blur-sm border border-brand-gold/30 rounded-lg p-6">
            <h3 className="text-xl md:text-2xl font-bold mb-3 font-display">¿ESTÁS LISTO PARA LA EXPERIENCIA?</h3>
            <p className="text-gray-400 mb-4 font-sans">
              Cada minuto cuenta. Cada decisión importa. ¿Tienes lo que se necesita para descifrar y escapar?
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <a
                href="#reservas"
                className="flex items-center gap-2 bg-brand-gold text-brand-dark font-bold py-3 px-6 rounded-lg group"
              >
                <Clock className="h-5 w-5 group-hover:hidden" />
                <Key className="h-5 w-5 hidden group-hover:block animate-key-turn" />
                RESERVA TU ESCAPE
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

