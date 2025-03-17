"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react"
import { SectionWrapper } from "@/components/home/section-wrapper"

// ⚠️ 1) Ajusta tus imágenes sin ?height=..., 
//    para que Next las sirva de /public sin problemas.
const galleryImages = [
  {
    id: 1,
    src: "/group2.svg", // <-- Sin parámetros
    alt: "Jugadores resolviendo acertijos",
    category: "jugadores",
  },
  {
    id: 2,
    src: "/group2.svg", // <-- Sin parámetros
    alt: "Interior del Asilo Maldito",
    category: "salas",
  },
  {
    id: 3,
    src: "/group2.svg",
    alt: "Decoración terrorífica",
    category: "decoracion",
  },
  {
    id: 4,
    src: "/group2.svg",
    alt: "Equipo celebrando su escape",
    category: "jugadores",
  },
  {
    id: 5,
    src: "/group2.svg",
    alt: "Interior de la Mansión Embrujada",
    category: "salas",
  },
  {
    id: 6,
    src: "/group2.svg",
    alt: "Acertijos y pistas",
    category: "acertijos",
  },
  {
    id: 7,
    src: "/group2.svg",
    alt: "Efectos especiales",
    category: "efectos",
  },
  {
    id: 8,
    src: "/group2.svg",
    alt: "Interior del Laboratorio Zombie",
    category: "salas",
  },
]

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>("todos")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  // Filtrado normal
  const filteredImages = filter === "todos"
    ? galleryImages
    : galleryImages.filter((img) => img.category === filter)

  // Modal handlers
  const openModal = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = "hidden"
  }
  const closeModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }
  const nextImage = () => {
    if (selectedImage == null) return
    setSelectedImage((prev) => ((prev ?? 0) + 1) % filteredImages.length)
  }
  const prevImage = () => {
    if (selectedImage == null) return
    setSelectedImage((prev) => ((prev ?? 0) - 1 + filteredImages.length) % filteredImages.length)
  }

  const categories = [
    { id: "todos", label: "Todos" },
    { id: "salas", label: "Salas" },
    { id: "jugadores", label: "Jugadores" },
    { id: "decoracion", label: "Decoración" },
    { id: "acertijos", label: "Acertijos" },
    { id: "efectos", label: "Efectos" },
  ]

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <SectionWrapper
      id="galeria"
      className="bg-gradient-to-b from-[#0a141f] to-brand-dark rounded-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 horror-title">
            GALERÍA DE <span className="text-brand-gold">IMÁGENES</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-2">
            Explora nuestra colección de imágenes y descubre el terror que te espera.
          </p>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-4"></div>
        </motion.div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-2 rounded-full text-sm shadow-md whitespace-nowrap
                ${
                  filter === category.id
                    ? "bg-brand-gold text-brand-dark"
                    : "bg-brand-dark/60 text-gray-300 hover:bg-brand-gold/20 border border-brand-gold/30"
                }
                transition-colors
              `}
              onClick={() => setFilter(category.id)}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Galería */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group floating-card"
                onClick={() => openModal(index)}
              >
                {/*
                  2) Quitamos fill y params, 
                     Indicamos width & height => Next optimiza las imágenes
                */}
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={800}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  // 3) Optional: placeholder="blur" blurDataURL="/tiny-blur.jpg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal de galería */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 
                2) Eliminamos fill, 
                   width & height => se optimiza 
              */}
              <Image
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt}
                width={1200}
                height={675}
                className="object-contain w-full h-full"
                // 3) placeholder="blur" blurDataURL="/tiny-blur.jpg"
              />

              <button
                className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/80 transition-colors"
                onClick={closeModal}
              >
                <X className="h-6 w-6" />
              </button>

              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/80 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/80 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 text-center text-white bg-black/50 py-3 backdrop-blur-sm">
                {filteredImages[selectedImage].alt}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
