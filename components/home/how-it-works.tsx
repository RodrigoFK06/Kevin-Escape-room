"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Users, Brain, Search, Key, Clock, DoorOpen } from "lucide-react"

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
      description: "De 2 a 6 jugadores para vivir una historia real dentro de un escenario completamente ambientado.",
      delay: 0.1,
    },
    {
      icon: <Brain className="h-10 w-10 md:h-12 md:w-12 text-brand-gold" />,
      title: "Resuelve enigmas",
      description: "Descifra códigos, sonidos y objetos creados para responder a tus acciones.",
      delay: 0.2,
    },
    {
      icon: <Search className="h-10 w-10 md:h-12 md:w-12 text-brand-gold" />,
      title: "Descubre secretos",
      description: "Interactúa con el entorno, las luces, voces y efectos te harán olvidar que es un juego.",
      delay: 0.3,
    },
    {
      icon: <Key className="h-10 w-10 md:h-12 md:w-12 text-brand-gold" />,
      title: "Encuentra las llaves",
      description: "Cada elemento del cuarto está conectado, Lo que toques... puede activar algo inesperado.",
      delay: 0.4,
    },
    {
      icon: <Clock className="h-10 w-10 md:h-12 md:w-12 text-brand-gold" />,
      title: "Contra el tiempo",
      description: "Tienes 60 minutos de tensión real, donde la historia avanza contigo dentro.",
      delay: 0.5,
    },
    {
      icon: <DoorOpen className="h-10 w-10 md:h-12 md:w-12 text-brand-gold" />,
      title: "Escapa o quédate",
      description: "Encuentra la salida y conviértete en parte de la historia de ENCRYPTED.",
      delay: 0.6,
    },
  ]

  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-brand-dark relative overflow-hidden w-full">
      {/* Línea vertical central en desktop */}
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
              {/* ESTE bloque se mantiene sin cambios */}
              <div
                className={`absolute top-10 ${index % 2 === 0 ? "right-0" : "left-0"} w-12 h-0.5 bg-brand-gold/50 hidden md:block`}
              ></div>

              {/* ESTE círculo central se mantiene sin cambios (para la línea horizontal) */}
              <div
                className={`
        absolute top-10
        ${index % 2 === 0 ? "right-0" : "left-0"}
        w-6 h-6
        rounded-full
        bg-brand-gold
        text-brand-dark
        flex
        items-center
        justify-center
        font-bold
        text-sm
        transform
        ${index % 2 === 0 ? "translate-x-1/2" : "-translate-x-1/2"}
        -translate-y-1/2
        hidden md:flex
      `}
              >
                {/* <--- NO BORRAR NI MOVER ESTE DIV */}
              </div>

              {/* Tarjeta principal */}
              <div className="bg-[#0a141f]/50 border border-brand-gold/20 rounded-lg p-6 hover:border-brand-gold/50 transition-all duration-300 relative">

                <div
                  className={`
    absolute top-0
    -translate-y-1/2
    w-8 h-8
    rounded-full
    bg-brand-gold
    text-brand-dark
    flex items-center justify-center
    font-bold text-sm

    ${index % 2 === 0
                      ? "left-0 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-1/2"
                      : "right-0 translate-x-1/2 md:left-0 md:-translate-x-1/2"
                    }
  `}
                  style={{
                    marginTop: "-0.5rem"
                  }}
                >
                  {index + 1}
                </div>


                {/* Ícono */}
                <div className={`flex ${index % 2 === 0 ? "md:justify-end" : ""} mb-4`}>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-brand-gold/20 rounded-full blur-sm"></div>
                    <div className="relative bg-brand-dark p-3 md:p-4 rounded-full">
                      {step.icon}
                    </div>
                  </div>
                </div>

                {/* Título */}
                <h3
                  className={`text-xl md:text-2xl font-bold mb-3 font-display ${index % 2 === 0 ? "md:text-right" : ""
                    }`}
                >
                  {step.title}
                </h3>

                {/* Descripción */}
                <p
                  className={`text-gray-400 text-sm md:text-base font-sans ${index % 2 === 0 ? "md:text-right" : ""
                    }`}
                >
                  {step.description}
                </p>
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
            <h3 className="text-xl md:text-2xl font-bold mb-3 font-display">¿ESTÁS LISTO PARA LA EXPERIENCIA MÁS INMERSIVA DEL PERÚ?</h3>
            <p className="text-gray-400 mb-4 font-sans">
              En ENCRYPTED, no observas la historia. La vives.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <a
                href="/reservas"
                className="flex items-center gap-2 bg-brand-gold text-brand-dark font-bold py-3 px-6 rounded-lg group"
              >
                <Clock className="h-5 w-5 group-hover:hidden" />
                <Key className="h-5 w-5 hidden group-hover:block animate-key-turn" />
                AGENDA TU MISIÓN
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
