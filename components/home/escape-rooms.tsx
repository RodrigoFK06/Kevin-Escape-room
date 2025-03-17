"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import { Star, Users, Clock, Lock, Key, Flame } from "lucide-react"

type Room = {
  id: string
  name: string
  image: string
  difficulty: number
  players: string
  time: string
  description: string
  bookings: number
  featured?: boolean
  tags?: string[]
}

export function EscapeRooms() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const [rooms] = useState<Room[]>([
    {
      id: "codigo-enigma",
      name: "Código Enigma",
      image: "/placeholder.svg?height=600&width=800",
      difficulty: 4,
      players: "2-6",
      time: "60 min",
      description:
        "Atrapado en una antigua oficina de inteligencia, debes descifrar los códigos secretos para evitar que información clasificada caiga en manos enemigas.",
      bookings: 15,
      featured: true,
      tags: ["Enigmas", "Histórico", "Difícil"],
    },
    {
      id: "la-boveda",
      name: "La Bóveda",
      image: "/placeholder.svg?height=600&width=800",
      difficulty: 5,
      players: "3-6",
      time: "60 min",
      description:
        "Un robo perfecto a la bóveda más segura del mundo. Encuentra la combinación maestra y escapa con el botín antes de que suene la alarma.",
      bookings: 20,
      featured: true,
      tags: ["Heist", "Lógica", "Extremo"],
    },
    {
      id: "el-laboratorio",
      name: "El Laboratorio",
      image: "/placeholder.svg?height=600&width=800",
      difficulty: 3,
      players: "2-6",
      time: "60 min",
      description:
        "Un experimento secreto ha salido mal. Descubre la fórmula correcta y escapa del laboratorio antes de que sea demasiado tarde.",
      bookings: 12,
      tags: ["Ciencia", "Misterio", "Medio"],
    },
  ])

  const renderStars = (difficulty: number) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < difficulty ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`}
        />
      ))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="cuartos"
      className="my-12 py-16 md:py-24 bg-gradient-to-b from-brand-dark to-[#0a141f] relative w-full overflow-hidden rounded-2xl"
    >
      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-repeat opacity-5"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-display">
            CUARTOS DE <span className="text-brand-gold">ESCAPE</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-2 font-sans">
            Elige tu desafío. Cada sala ofrece una experiencia única de enigmas y misterios. ¿Tienes lo necesario para
            encontrar la llave?
          </p>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-4"></div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Sala destacada - MODIFICADA para mejorar vista móvil */}
          <motion.div variants={itemVariants} className="lg:col-span-8 lg:row-span-2">
            <div
              className="
                relative
                min-h-[500px]       /* Altura aumentada para móvil */
                md:min-h-[525px]    /* Ajuste para tablets */
                lg:h-[550px]        /* Mantiene altura en desktop */
                rounded-xl 
                overflow-hidden 
                border border-brand-gold/20 
                hover:border-brand-gold/50 
                transition-all 
                duration-300 
                group
              "
            >
              <Image
                src={rooms[0].image || "/placeholder.svg"}
                alt={rooms[0].name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>

              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8">
                {rooms[0].featured && (
                  <div className="absolute top-3 right-3 bg-brand-gold/90 text-brand-dark px-2 py-1 rounded-full text-xs font-bold flex items-center">
                    <Flame className="h-3 w-3 mr-1" />
                    DESTACADO
                  </div>
                )}

                <h3 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-white font-display">
                  {rooms[0].name}
                </h3>

                <div className="flex items-center mb-2 md:mb-3">
                  <div className="flex mr-3 md:mr-4">{renderStars(rooms[0].difficulty)}</div>
                  <span className="text-xs md:text-sm text-gray-300 font-sans">Dificultad</span>
                </div>

                <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-4">
                  {rooms[0].tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#0a141f]/50 border border-brand-gold/30 px-2 py-0.5 rounded text-xs font-sans"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Descripción con opciones para truncar en móvil */}
                <p className="text-gray-300 mb-3 md:mb-6 text-sm md:text-lg max-w-2xl line-clamp-3 md:line-clamp-none font-sans">
                  {rooms[0].description}
                </p>

                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4">
                  <div className="flex items-center bg-brand-dark/70 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 rounded-lg">
                    <Users className="h-3 w-3 md:h-4 md:w-4 text-brand-gold mr-1 md:mr-2" />
                    <span className="text-xs md:text-sm text-gray-300 font-sans">{rooms[0].players} jugadores</span>
                  </div>
                  <div className="flex items-center bg-brand-dark/70 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 rounded-lg">
                    <Clock className="h-3 w-3 md:h-4 md:w-4 text-brand-gold mr-1 md:mr-2" />
                    <span className="text-xs md:text-sm text-gray-300 font-sans">{rooms[0].time}</span>
                  </div>
                  <div className="flex items-center bg-brand-dark/70 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 rounded-lg">
                    <Key className="h-3 w-3 md:h-4 md:w-4 text-brand-gold mr-1 md:mr-2" />
                    <span className="text-xs md:text-sm text-gray-300 font-sans">Dificultad alta</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                  <Button variant="default" size="sm" className="group font-sans sm:text-base" asChild>
                    <Link href="#reservas" className="flex items-center gap-2">
                      <Lock className="h-3 w-3 md:h-4 md:w-4 group-hover:hidden" />
                      <Key className="h-3 w-3 md:h-4 md:w-4 hidden group-hover:block animate-key-turn" />
                      Reservar Ahora
                    </Link>
                  </Button>

                  <p className="text-xs md:text-sm text-center sm:text-left text-brand-gold animate-pulse flex items-center justify-center sm:justify-start font-sans">
                    <Lock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    {rooms[0].bookings} personas reservaron esta sala hoy
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Salas secundarias - Sin cambios */}
          <div className="lg:col-span-4 grid grid-cols-1 gap-8">
            {rooms.slice(1).map((room) => (
              <motion.div key={room.id} variants={itemVariants}>
                <div
                  className="
                    bg-brand-dark 
                    border border-brand-gold/20 
                    rounded-lg 
                    overflow-hidden 
                    hover:border-brand-gold/50 
                    transition-all 
                    duration-300 
                    group 
                    h-full
                  "
                >
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <Image
                      src={room.image || "/placeholder.svg"}
                      alt={room.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent"></div>

                    {room.featured && (
                      <div className="absolute top-2 right-2 bg-brand-gold/90 text-brand-dark px-2 py-0.5 rounded-full text-xs font-bold flex items-center">
                        <Flame className="h-3 w-3 mr-1" />
                        DESTACADO
                      </div>
                    )}
                  </div>

                  <div className="p-5 md:p-6">
                    <h3
                      className="
                        text-xl 
                        md:text-2xl 
                        font-bold 
                        mb-2 
                        text-white 
                        group-hover:text-brand-gold 
                        transition-colors 
                        font-display
                      "
                    >
                      {room.name}
                    </h3>

                    <div className="flex items-center mb-3">
                      <div className="flex mr-4">{renderStars(room.difficulty)}</div>
                      <span className="text-xs md:text-sm text-gray-400 font-sans">Dificultad</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="
                            bg-[#0a141f]/50 
                            border 
                            border-brand-gold/30 
                            px-1.5 
                            py-0.5 
                            rounded 
                            text-xs 
                            font-sans
                          "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 md:h-4 md:w-4 text-brand-gold mr-1" />
                        <span className="text-xs md:text-sm text-gray-400 font-sans">{room.players} jugadores</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 text-brand-gold mr-1" />
                        <span className="text-xs md:text-sm text-gray-400 font-sans">{room.time}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-4 line-clamp-2 text-sm md:text-base font-sans">
                      {room.description}
                    </p>

                    <div className="flex flex-col space-y-3">
                      <Button variant="default" className="w-full group font-sans" asChild>
                        <Link href="#reservas" className="flex items-center justify-center gap-2">
                          <Lock className="h-4 w-4 group-hover:hidden" />
                          <Key className="h-4 w-4 hidden group-hover:block animate-key-turn" />
                          Reservar Ahora
                        </Link>
                      </Button>

                      <p className="text-xs text-center text-brand-gold animate-pulse font-sans">
                        {room.bookings} personas reservaron esta sala hoy
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sección de estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          <div className="bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/20 rounded-lg p-6 hover:border-brand-gold/40 transition-all duration-300">
            <div className="text-4xl font-bold text-brand-gold mb-2 font-display">98%</div>
            <p className="text-gray-300 font-sans">Tasa de adrenalina</p>
          </div>
          <div className="bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/20 rounded-lg p-6 hover:border-brand-gold/40 transition-all duration-300">
            <div className="text-4xl font-bold text-brand-gold mb-2 font-display">+5000</div>
            <p className="text-gray-300 font-sans">Enigmas resueltos</p>
          </div>
          <div className="bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/20 rounded-lg p-6 hover:border-brand-gold/40 transition-all duration-300">
            <div className="text-4xl font-bold text-brand-gold mb-2 font-display">42%</div>
            <p className="text-gray-300 font-sans">Tasa de escape</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
