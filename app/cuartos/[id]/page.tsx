'use client';

import { useEffect } from "react";
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/ui/footer"
import { RoomGallery } from "@/components/rooms/room-gallery"
import { RoomReviews } from "@/components/rooms/room-reviews"
import { RoomDifficulty } from "@/components/rooms/room-difficulty"
import { RoomBookingWidget } from "@/components/rooms/room-booking-widget"
import { Star, Users, Clock, Skull, Brain, Lock } from "lucide-react"
import { MetaEvents } from "@/components/analytics/meta-pixel"

// Datos simulados de las salas
const rooms = [
  {
    id: "asylum",
    name: "El Asilo Maldito",
    image: "/placeholder.svg?height=600&width=800",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    difficulty: 4,
    players: "2-6",
    time: "60 min",
    description:
      "Encerrado en un asilo psiquiátrico abandonado, debes encontrar la salida antes de que los antiguos pacientes te atrapen para siempre.",
    longDescription: `
      <p>El Asilo Maldito fue cerrado en 1953 tras una serie de misteriosas muertes y desapariciones. Los rumores hablan de experimentos inhumanos realizados por el Dr. Blackwood, el director del asilo, quien desapareció la noche del cierre.</p>
      
      <p>60 años después, tú y tu equipo se adentran en el abandonado edificio para investigar los sucesos paranormales reportados por los vecinos. Al entrar, las puertas se cierran detrás de ustedes y comienzan a escuchar voces y gritos provenientes de las antiguas habitaciones.</p>
      
      <p>Tienen 60 minutos para descubrir los oscuros secretos del Dr. Blackwood y encontrar la salida antes de que los espíritus de los antiguos pacientes los atrapen para siempre.</p>
    `,
    features: [
      "Efectos de sonido inmersivos",
      "Iluminación atmosférica",
      "Acertijos mecánicos y electrónicos",
      "Elementos de terror psicológico",
      "Narrativa ramificada según decisiones",
    ],
    reviews: [
      {
        id: 1,
        name: "Carlos Mendoza",
        image: "/placeholder.svg?height=100&width=100",
        rating: 5,
        comment:
          "¡Increíble experiencia! El Asilo Maldito nos hizo gritar de miedo. Logramos escapar con solo 2 minutos restantes.",
        date: "15/03/2023",
      },
      {
        id: 2,
        name: "Laura Jiménez",
        image: "/placeholder.svg?height=100&width=100",
        rating: 4,
        comment:
          "La ambientación es espectacular, realmente te sientes dentro de un asilo abandonado. Los acertijos son desafiantes pero lógicos.",
        date: "22/04/2023",
      },
    ],
    bookings: 4,
    tags: ["Terror", "Psicológico", "Difícil"],
  },
  {
    id: "mansion",
    name: "La Mansión Embrujada",
    image: "/placeholder.svg?height=600&width=800",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    difficulty: 3,
    players: "3-6",
    time: "60 min",
    description:
      "Una antigua mansión con un oscuro secreto. Los espíritus no descansan y el tiempo se agota. Descubre la verdad y escapa.",
    longDescription: `
      <p>La Mansión Blackwood ha permanecido abandonada durante décadas tras la misteriosa desaparición de toda la familia en una noche de tormenta. Los rumores locales hablan de un pacto con fuerzas oscuras que salió mal.</p>
      
      <p>Tu equipo de investigadores paranormales ha conseguido permiso para pasar una noche en la mansión. Al entrar, sienten una presencia que los observa desde las sombras y escuchan susurros en las paredes.</p>
      
      <p>Tienen 60 minutos para descubrir qué ocurrió realmente con la familia Blackwood y escapar antes de que los espíritus los atrapen en la mansión para siempre.</p>
    `,
    features: [
      "Habitaciones temáticas interconectadas",
      "Efectos especiales atmosféricos",
      "Acertijos basados en la historia familiar",
      "Elementos móviles y pasadizos secretos",
      "Narrativa inmersiva con giros inesperados",
    ],
    reviews: [
      {
        id: 1,
        name: "María Fernández",
        image: "/placeholder.svg?height=100&width=100",
        rating: 5,
        comment:
          "La Mansión Embrujada superó todas nuestras expectativas. Los acertijos son desafiantes y la ambientación es perfecta.",
        date: "22/03/2023",
      },
      {
        id: 2,
        name: "Pedro Sánchez",
        image: "/placeholder.svg?height=100&width=100",
        rating: 4,
        comment:
          "Excelente experiencia, la historia es muy inmersiva y los sustos están muy bien logrados. Recomendado para grupos.",
        date: "15/05/2023",
      },
    ],
    bookings: 7,
    tags: ["Fantasmas", "Misterio", "Medio"],
  },
  {
    id: "laboratory",
    name: "Laboratorio Zombie",
    image: "/placeholder.svg?height=600&width=800",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    difficulty: 5,
    players: "4-6",
    time: "60 min",
    description:
      "Un virus se ha propagado. Estás atrapado en el laboratorio donde todo comenzó. Encuentra la cura y escapa antes de infectarte.",
    longDescription: `
      <p>Un laboratorio secreto de investigación biológica ha sufrido una brecha de contención. El virus experimental Z-12 se ha liberado, convirtiendo a los científicos y personal de seguridad en criaturas sedientas de sangre.</p>
      
      <p>Tu equipo de especialistas ha sido enviado para recuperar la investigación del Dr. Hoffman, que contiene la única cura posible. Al entrar al laboratorio, las puertas de seguridad se cierran automáticamente, activando el protocolo de cuarentena.</p>
      
      <p>Tienen 60 minutos para encontrar la fórmula de la cura, sintetizarla y escapar antes de que el sistema de autodestrucción se active o, peor aún, antes de que los infectados los encuentren.</p>
    `,
    features: [
      "Efectos especiales de alta tecnología",
      "Puzzles científicos y lógicos",
      "Elementos de terror y supervivencia",
      "Múltiples finales posibles",
      "Interacción con equipamiento de laboratorio",
    ],
    reviews: [
      {
        id: 1,
        name: "Javier López",
        image: "/placeholder.svg?height=100&width=100",
        rating: 4,
        comment:
          "El Laboratorio Zombie es el escape room más difícil que he jugado. No logramos escapar, pero volveremos a intentarlo.",
        date: "05/04/2023",
      },
      {
        id: 2,
        name: "Ana Martínez",
        image: "/placeholder.svg?height=100&width=100",
        rating: 5,
        comment:
          "¡Increíble! Los efectos especiales son de primera categoría y la tensión se mantiene durante toda la experiencia.",
        date: "12/06/2023",
      },
    ],
    bookings: 3,
    tags: ["Zombies", "Ciencia", "Extremo"],
  },
]

export default function RoomPage({ params }: { params: { id: string } }) {
  const room = rooms.find((r) => r.id === params.id)

  if (!room) {
    notFound()
  }

  // ✅ Disparar evento ViewContent cuando se visualiza la sala
  useEffect(() => {
    if (room) {
      // Mapear ID a número para el tracking
      const roomIdMap: Record<string, number> = {
        'asylum': 1,
        'mansion': 2,
        'vault': 3
      };
      
      MetaEvents.viewRoom(room.name, roomIdMap[params.id] || 0);
    }
  }, [room, params.id]);

  const renderStars = (difficulty: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < difficulty ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} />
      ))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full overflow-hidden noise-bg">
      <Header />

      {/* Hero Section */}
      <section className="w-full pt-24 md:pt-32 pb-12 md:pb-16 bg-brand-dark relative">
        <div className="absolute inset-0 bg-[url('/lobo.svg?height=800&width=1200')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark/95 to-brand-dark"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Imagen principal */}
            <div className="w-full md:w-1/2">
              <div className="relative aspect-video rounded-lg overflow-hidden horror-card">
                <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent"></div>

                {/* Etiquetas */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {room.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-brand-gold/90 text-brand-dark px-3 py-1 rounded-full text-xs font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Galería de imágenes */}
              <RoomGallery images={room.gallery} />
            </div>

            {/* Información */}
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-brand-light horror-text">
                {room.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex mr-4">{renderStars(room.difficulty)}</div>
                <span className="text-sm text-gray-300">Dificultad {room.difficulty}/5</span>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center bg-brand-dark/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-brand-gold/20">
                  <Users className="h-5 w-5 text-brand-gold mr-2" />
                  <span className="text-sm text-gray-300">{room.players} jugadores</span>
                </div>
                <div className="flex items-center bg-brand-dark/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-brand-gold/20">
                  <Clock className="h-5 w-5 text-brand-gold mr-2" />
                  <span className="text-sm text-gray-300">{room.time}</span>
                </div>
                <div className="flex items-center bg-brand-dark/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-brand-gold/20">
                  <Skull className="h-5 w-5 text-brand-gold mr-2" />
                  <span className="text-sm text-gray-300">Terror extremo</span>
                </div>
              </div>

              <p className="text-gray-300 mb-6 text-lg leading-relaxed">{room.description}</p>

              <div className="mb-6">
                <RoomDifficulty difficulty={room.difficulty} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="destructive" size="lg" className="horror-button" asChild>
                  <Link href="/reservas">RESERVAR AHORA</Link>
                </Button>

                <Button
                  variant="outline"
                  className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark horror-button"
                  asChild
                >
                  <Link href="#galeria">VER GALERÍA</Link>
                </Button>
              </div>

              <div className="mt-4 flex items-center text-brand-gold">
                <Lock className="h-4 w-4 mr-2" />
                <p className="text-sm animate-pulse">{room.bookings} personas reservaron esta sala hoy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Descripción detallada */}
      <section className="w-full py-12 md:py-16 bg-gradient-to-b from-brand-dark to-brand-blue relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 horror-title">
                SOBRE LA <span className="text-brand-gold">EXPERIENCIA</span>
              </h2>

              <div
                className="text-gray-300 space-y-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: room.longDescription }}
              />

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Brain className="h-5 w-5 text-brand-gold mr-2" />
                  Características especiales
                </h3>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {room.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-brand-gold mr-2">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reseñas */}
              <div className="mt-12">
                <RoomReviews reviews={room.reviews} />
              </div>
            </div>

            {/* Widget de reserva */}
            <div className="md:col-span-1" id="reservar">
              <div className="sticky top-24">
                <RoomBookingWidget room={room} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Otras salas */}
      <section className="w-full py-12 md:py-16 bg-brand-dark relative">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center horror-title">
            OTRAS <span className="text-brand-gold">EXPERIENCIAS</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms
              .filter((r) => r.id !== room.id)
              .map((otherRoom) => (
                <div
                  key={otherRoom.id}
                  className="bg-brand-blue/50 border border-brand-gold/20 rounded-lg overflow-hidden hover:border-brand-gold/50 transition-all duration-300 group horror-card"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3 relative">
                      <div className="relative h-48 sm:h-full">
                        <Image
                          src={otherRoom.image || "/placeholder.svg"}
                          alt={otherRoom.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-2/3 p-4 md:p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-brand-gold transition-colors">
                        {otherRoom.name}
                      </h3>

                      <div className="flex items-center mb-3">
                        <div className="flex mr-3">{renderStars(otherRoom.difficulty)}</div>
                        <span className="text-xs text-gray-400">Dificultad</span>
                      </div>

                      <p className="text-gray-400 mb-4 line-clamp-2 text-sm">{otherRoom.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center text-xs text-gray-400">
                          <Users className="h-3 w-3 text-brand-gold mr-1" />
                          <span>{otherRoom.players}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 text-brand-gold mr-1" />
                          <span>{otherRoom.time}</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark horror-button"
                        asChild
                      >
                        <Link href={`/cuartos/${otherRoom.id}`}>VER DETALLES</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

