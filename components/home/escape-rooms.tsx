"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Star,
  Users,
  Clock,
  Lock,
  Key,
  Flame,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Slide = {
  type: "video" | "image";
  url: string;
};

type Room = {
  id: string;
  name: string;
  image: string;
  difficulty: number;
  happy: number;
  players: string;
  time: string;
  description: string;
  bookings: number;
  featured?: boolean;
  tags?: string[];
  slides?: Slide[]; // ← Cada sala puede tener un array de slides
};

export function EscapeRooms() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  // Control del Modal general:
  const [showModal, setShowModal] = useState(false);
  const [currentSlides, setCurrentSlides] = useState<Slide[]>([]); // Slides de la sala actual
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Ejemplo de datos de sala con su propio array de slides
  const [rooms] = useState<Room[]>([
    {
      id: "codigo-enigma",
      name: "Código Enigma",
      image: "/placeholder.svg?height=600&width=800",
      difficulty: 4,
      happy: 5,
      players: "2-6",
      time: "60 min",
      description:
        "Atrapado en una oficina de inteligencia, debes descifrar códigos para evitar que la info caiga en malas manos.",
      bookings: 3,
      featured: true,
      tags: ["Enigmas", "Histórico", "Difícil"],
      slides: [
        { type: "video", url: "/trailer.mp4" },
        { type: "image", url: "/fondo1.jpeg" },
        { type: "image", url: "/fondo2.jpg" },
      ],
    },
    {
      id: "la-boveda",
      name: "La Bóveda",
      image: "/placeholder.svg?height=600&width=800",
      difficulty: 5,
      happy: 5,
      players: "3-6",
      time: "60 min",
      description:
        "Un robo perfecto a la bóveda más segura. Encuentra la combinación y escapa antes de la alarma.",
      bookings: 2,
      featured: true,
      tags: ["Heist", "Lógica", "Extremo"],
      slides: [
        { type: "video", url: "/trailer.mp4" },
        { type: "image", url: "/boveda-1.jpg" },
        { type: "image", url: "/boveda-2.jpg" },
      ],
    },
    {
      id: "el-laboratorio",
      name: "El Laboratorio",
      image: "/placeholder.svg?height=600&width=800",
      difficulty: 3,
      happy: 5,
      players: "2-6",
      time: "60 min",
      description:
        "Un experimento salió mal. Descubre la fórmula y escapa del laboratorio antes de que sea tarde.",
      bookings: 3,
      tags: ["Ciencia", "Misterio", "Medio"],
      slides: [
        { type: "video", url: "/trailer.mp4" },
        { type: "image", url: "/lab-img1.jpeg" },
      ],
    },
  ]);

  // Función para renderizar estrellas
  const renderStars = (value: number) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < value ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
          }`}
        />
      ));

  // Función para abrir el modal con las slides de esa sala
  const handleOpenModal = (slides: Slide[]) => {
    setCurrentSlides(slides);
    setCurrentSlideIndex(0);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Navegación del carrusel
  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % currentSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + currentSlides.length) % currentSlides.length);
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

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
            Elige tu desafío. Cada sala ofrece una experiencia única de enigmas y
            misterios. ¿Tienes lo necesario para encontrar la llave?
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
          {/* Sala destacada (index 0) */}
          <motion.div variants={itemVariants} className="lg:col-span-8 lg:row-span-2">
            {/* ... Mismo layout con la imagen principal ... */}
            <div
              className="
                relative
                min-h-[500px]
                md:min-h-[525px]
                lg:h-[580px]
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

              {/* Play button si esa sala tiene slides */}
              {rooms[0].slides && rooms[0].slides.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <button
                    onClick={() => handleOpenModal(rooms[0].slides!)}
                    className="bg-black/50 hover:bg-black/70 p-4 rounded-full transition-all"
                  >
                    <Play className="h-8 w-8 text-white" />
                  </button>
                </div>
              )}

              {/* Info sala */}
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
                <div className="flex items-center mb-2 md:mb-3">
                  <div className="flex mr-3 md:mr-4">{renderStars(rooms[0].happy)}</div>
                  <span className="text-xs md:text-sm text-gray-300 font-sans">Diversión</span>
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

                <p className="text-gray-300 mb-3 md:mb-6 text-sm md:text-lg max-w-2xl line-clamp-3 md:line-clamp-none font-sans">
                  {rooms[0].description}
                </p>

                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4">
                  <div className="flex items-center bg-brand-dark/70 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 rounded-lg">
                    <Users className="h-3 w-3 md:h-4 md:w-4 text-brand-gold mr-1 md:mr-2" />
                    <span className="text-xs md:text-sm text-gray-300 font-sans">
                      {rooms[0].players} jugadores
                    </span>
                  </div>
                  <div className="flex items-center bg-brand-dark/70 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 rounded-lg">
                    <Clock className="h-3 w-3 md:h-4 md:w-4 text-brand-gold mr-1 md:mr-2" />
                    <span className="text-xs md:text-sm text-gray-300 font-sans">
                      {rooms[0].time}
                    </span>
                  </div>
                  <div className="flex items-center bg-brand-dark/70 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 rounded-lg">
                    <Key className="h-3 w-3 md:h-4 md:w-4 text-brand-gold mr-1 md:mr-2" />
                    <span className="text-xs md:text-sm text-gray-300 font-sans">
                      Record: 40 min
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                  <Button variant="default" size="sm" className="group font-sans sm:text-base" asChild>
                    <Link href="/reservas" className="flex items-center gap-2">
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

          {/* Salas secundarias (los demás) */}
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
                    {/* Botón Play si esa sala tiene slides */}
                    {room.slides && room.slides.length > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <button
                          onClick={() => handleOpenModal(room.slides!)}
                          className="bg-black/50 hover:bg-black/70 p-3 rounded-full transition-all"
                        >
                          <Play className="h-6 w-6 text-white" />
                        </button>
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
                    <div className="flex items-center mb-3">
                      <div className="flex mr-4">{renderStars(room.happy)}</div>
                      <span className="text-xs md:text-sm text-gray-400 font-sans">Diversión</span>
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
                        <span className="text-xs md:text-sm text-gray-400 font-sans">
                          {room.players} jugadores
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 text-brand-gold mr-1" />
                        <span className="text-xs md:text-sm text-gray-400 font-sans">
                          {room.time}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-4 line-clamp-2 text-sm md:text-base font-sans">
                      {room.description}
                    </p>

                    <div className="flex flex-col space-y-3">
                      <Button variant="default" className="w-full group font-sans" asChild>
                        <Link href="/reservas" className="flex items-center justify-center gap-2">
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
      </div>

      {/* MODAL del carrusel */}
      <AnimatePresence>
        {showModal && currentSlides && currentSlides.length > 0 && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón Cerrar */}
              <button
                className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 transition text-white rounded-full p-1 z-50"
                onClick={handleCloseModal}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Botón Anterior */}
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 transition text-white rounded-full p-2 z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Botón Siguiente */}
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 transition text-white rounded-full p-2 z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Slide actual */}
              <div className="w-full h-full relative">
                {currentSlides[currentSlideIndex].type === "video" ? (
                  <video
                    src={currentSlides[currentSlideIndex].url}
                    autoPlay
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={currentSlides[currentSlideIndex].url}
                      alt={`Slide ${currentSlideIndex}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
