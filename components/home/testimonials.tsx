"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Star, Trophy, Clock, ChevronLeft, ChevronRight, Quote, Lock, Key } from "lucide-react"

type Testimonial = {
  id: number
  name: string
  image: string
  rating: number
  comment: string
  date: string
  room: string
}

type TeamRanking = {
  id: number
  name: string
  time: string
  date: string
  room: string
  puntaje: string
}

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [visibleCount, setVisibleCount] = useState(6)

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Carlos Mendoza",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      comment:
        "¡Increíble experiencia! EL PACIENTE 136 nos hizo pensar como nunca. Logramos escapar con solo 2 minutos faltantes. La ambientación es impresionante y los acertijos están muy bien pensados. Definitivamente volveremos para probar otra sala.",
      date: "15/03/2023",
      room: "El Paciente 136",
    },
    {
      id: 2,
      name: "María González",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      comment:
        "El Último Conjuro fue simplemente mágico. Los efectos especiales y la historia te sumergen completamente. El nivel de dificultad es perfecto, ni muy fácil ni imposible. ¡Lo recomiendo 100%!",
      date: "22/04/2023",
      room: "El Último Conjuro",
    },
    {
      id: 3,
      name: "Roberto Sánchez",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4,
      comment:
        "La Secuencia Perdida puso a prueba nuestra lógica y trabajo en equipo. Los puzzles tecnológicos son únicos. Casi no logramos salir pero la experiencia valió cada segundo.",
      date: "10/05/2023",
      room: "La Secuencia Perdida",
    },
    {
      id: 4,
      name: "Ana Torres",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      comment:
        "Vinimos con mi grupo de amigas y fue la mejor actividad que hemos hecho juntas. Los Game Masters son muy profesionales y la experiencia es de primera clase. Ya reservamos para volver el próximo mes.",
      date: "18/06/2023",
      room: "El Paciente 136",
    },
  ]

  const [rankings, setRankings] = useState<TeamRanking[]>([])

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const res = await fetch("/api/ranking/obtener")
        const json = await res.json()
        if (json && Array.isArray(json)) {
          const parsed = json.map((item: any) => ({
            id: Number(item.id),
            name: item.equipo_nombre || 'Equipo Sin Nombre',
            time: `${item.tiempo || 0} min`,
            date: item.registrado_en || new Date().toISOString(),
            room: item.sala_nombre || 'Sala Desconocida',
            puntaje: `${item.puntaje || 0} pts`,
          }))
          setRankings(parsed)
        }
      } catch (err) {
        console.error("Error cargando ranking:", err)
      }
    }
    loadRanking()
  }, [])

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} />
      ))
  }

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section
      id="clasificacion"
      className="py-16 md:py-24 bg-gradient-to-b from-[#0a141f] to-brand-dark relative w-full overflow-hidden rounded-2xl"
    >
      <div className="absolute inset-0 bg-[url('/fondo1.jpeg?height=800&width=1200')] bg-cover bg-center opacity-5 rounded-2xl mb-12"></div>

      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#0a141f]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-brand-dark/50 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-display">
            TESTIMONIOS Y <span className="text-brand-gold">RANKING</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-2 font-sans">
            Solo los más rápidos logran escribir su nombre aquí. ¿Podrás superar su tiempo?
          </p>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-4"></div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
        >
          {/* Testimonios */}
          <motion.div variants={itemVariants} className="relative">
            <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center font-display">
              <Star className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 mr-2 fill-yellow-500" />
              Testimonios
            </h3>

            <div className="relative h-[400px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#0a141f] border border-brand-gold/20 rounded-lg p-6 hover:border-brand-gold/50 transition-all duration-300 h-full"
                >
                  <Quote className="h-10 w-10 text-brand-gold/20 absolute top-6 right-6" />

                  <div className="flex items-center mb-6">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-brand-gold/30">
                      <Image
                        src={testimonials[activeTestimonial].image || "/placeholder.svg"}
                        alt={testimonials[activeTestimonial].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg font-sans">{testimonials[activeTestimonial].name}</h4>
                      <div className="flex mb-1">{renderStars(testimonials[activeTestimonial].rating)}</div>
                      <div className="text-xs text-gray-400 flex items-center font-sans">
                        <Clock className="h-3 w-3 mr-1 text-brand-gold" />
                        {testimonials[activeTestimonial].date} • {testimonials[activeTestimonial].room}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 italic text-lg leading-relaxed mb-4 font-sans">
                    "{testimonials[activeTestimonial].comment}"
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Controles de navegación */}
              <div className="absolute bottom-6 right-6 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevTestimonial}
                  className="bg-[#0a141f]/80 border border-brand-gold/30 rounded-full p-2 text-brand-gold hover:bg-brand-gold/20 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextTestimonial}
                  className="bg-[#0a141f]/80 border border-brand-gold/30 rounded-full p-2 text-brand-gold hover:bg-brand-gold/20 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center mt-4 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${activeTestimonial === index ? "bg-brand-gold" : "bg-gray-600"}`}
                  aria-label={`Ver testimonio ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Ranking */}
          <motion.div variants={itemVariants} className="w-full overflow-hidden">
            <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center font-display">
              <Trophy className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 mr-2" />
              Ranking de Equipos
            </h3>

            {/* Contenedor principal del ranking */}
            <div className="bg-[#0a141f] border border-brand-gold/20 rounded-lg overflow-hidden w-full">
              <div className="p-3 md:p-4 bg-brand-gold/20 border-b border-brand-gold/30 grid grid-cols-12 gap-2 md:gap-4 text-sm md:text-base font-sans">
                <div className="col-span-1 font-bold text-center text-gray-200">#</div>
                <div className="col-span-4 font-bold text-gray-200">Equipo</div>
                <div className="col-span-2 font-bold text-center text-gray-200">Tiempo</div>
                <div className="col-span-2 font-bold text-center text-gray-200">Puntaje</div>
                <div className="col-span-3 font-bold text-center text-gray-200">Sala</div>
              </div>

              <div className="divide-y divide-brand-gold/10">
                {rankings.length === 0 ? (
                  <div className="p-8 text-center">
                    <Trophy className="h-12 w-12 text-brand-gold/30 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm md:text-base">
                      Aún no hay equipos en el ranking. ¡Sé el primero en aparecer aquí!
                    </p>
                  </div>
                ) : (
                  rankings.slice(0, visibleCount).map((team, index) => (
                  <motion.div
                    key={team.id}
                    className="p-3 md:p-4 grid grid-cols-12 gap-2 md:gap-4 hover:bg-brand-gold/5 transition-colors text-sm md:text-base font-sans"
                    whileHover={{
                      backgroundColor: "rgba(215, 151, 51, 0.1)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    {/* Columna Ranking (#) */}
                    <div className="col-span-1 text-center font-bold">
                      {index === 0 ? (
                        <span className="text-yellow-500 flex justify-center">
                          <Trophy className="h-4 w-4 fill-yellow-500" />
                        </span>
                      ) : index === 1 ? (
                        <span className="text-gray-300">2</span>
                      ) : index === 2 ? (
                        <span className="text-amber-600">3</span>
                      ) : (
                        <span className="text-gray-300">{index + 1}</span>
                      )}
                    </div>

                    {/* Columna Equipo */}
                    <div className="col-span-4 font-medium truncate text-gray-200">{team.name}</div>

                    {/* Columna Tiempo */}
                    <div className="col-span-2 text-center flex items-center justify-center text-gray-200">
                      <Clock className="h-3 w-3 md:h-4 md:w-4 text-brand-gold mr-1" />
                      <span>{team.time}</span>
                    </div>

                    {/* Columna Puntaje */}
                    <div className="col-span-2 text-center text-gray-200 truncate font-semibold">{team.puntaje}</div>

                    {/* Columna Sala */}
                    <div className="col-span-3 text-center text-gray-300 truncate text-xs md:text-sm">{team.room}</div>
                  </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Botón para cambiar la cantidad visible */}
            {rankings.length > 6 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setVisibleCount(visibleCount === 6 ? 10 : 6)}
                  className="text-brand-gold underline hover:no-underline text-sm md:text-base font-sans"
                >
                  {visibleCount === 6 ? "Ver los 10 mejores" : "Ver solo los 5 mejores"}
                </button>
              </div>
            )}

            {/* Bloque de texto y botón final */}
            <div className="mt-6 text-center bg-[#0a141f]/60 backdrop-blur-sm border border-brand-gold/30 rounded-lg p-4">
              <p className="text-gray-400 mb-4 text-sm md:text-base font-sans">
                {rankings.length > 0 ? (
                  <>
                    El equipo <strong className="text-brand-gold">{rankings[0].name}</strong> escapó en{" "}
                    <strong className="text-brand-gold">{rankings[0].time}</strong>. ¿Podrás superarlos?
                    <br />
                    Juega 3 veces y gana un 50% de descuento en tu siguiente juego.
                  </>
                ) : (
                  <>Compite por ser el equipo más rápido en nuestro ranking.</>
                )}
              </p>

              <Button variant="default" className="group font-sans" asChild>
                <Link
                  href="/reservas"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background h-10 px-4 py-2 w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark horror-button"
                >
                  <Lock className="h-4 w-4 group-hover:hidden" />
                  <Key className="h-4 w-4 hidden group-hover:block animate-key-turn" />
                  JUEGA Y APARECE EN EL RANKING
                </Link>
              </Button>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
