"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"
import { SectionWrapper } from "@/components/home/section-wrapper"

const blogPosts = [
  {
    id: 1,
    title: "Los 5 miedos más comunes en un escape room",
    excerpt:
      "Descubre cuáles son los temores más frecuentes que experimentan los jugadores y cómo superarlos para disfrutar al máximo.",
    image: "/placeholder.svg?height=400&width=600",
    date: "15 Mayo, 2023",
    author: "María Sánchez",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Consejos para escapar en tiempo récord",
    excerpt:
      "Estrategias y técnicas probadas por expertos para resolver los acertijos más complejos y escapar antes que nadie.",
    image: "/placeholder.svg?height=400&width=600",
    date: "3 Junio, 2023",
    author: "Carlos Mendoza",
    readTime: "7 min",
  },
  {
    id: 3,
    title: "Historia de terror: La noche en que nadie escapó",
    excerpt: "Relato basado en hechos reales sobre la experiencia más aterradora en nuestro Laboratorio Zombie.",
    image: "/placeholder.svg?height=400&width=600",
    date: "21 Junio, 2023",
    author: "Javier López",
    readTime: "10 min",
  },
]

export function BlogSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <SectionWrapper id="blog" className="bg-brand-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 md:mb-12"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 horror-title">
          BLOG Y <span className="text-brand-gold">NOTICIAS</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto px-2">
          Historias de terror, consejos para escapar y novedades sobre nuestras experiencias.
        </p>
        <div className="w-20 h-1 bg-brand-gold mx-auto mt-4"></div>
      </motion.div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
      >
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id}
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="floating-card overflow-hidden group"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent"></div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-brand-gold" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-brand-gold" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-gray-400 mb-4 text-sm line-clamp-3">{post.excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-400">
                  <User className="h-3 w-3 mr-1 text-brand-gold" />
                  <span>{post.author}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-gold hover:text-brand-gold/80 p-0 h-auto"
                  asChild
                >
                  <Link href={`/blog/${post.id}`} className="flex items-center">
                    <span className="mr-1">Próximamente</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 text-center"
      >
        <Button
          variant="outline"
          className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark horror-button"
          asChild
        >
        {/*<Link href="/blog">
            <span className="relative z-10">VER TODOS LOS ARTÍCULOS</span>
          </Link">*/}
        </Button>
      </motion.div>
    </SectionWrapper>
  )
}

