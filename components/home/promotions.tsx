"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Gift, Users, GraduationCap, Award } from "lucide-react"

export function Promotions() {
  const promotions = [
    {
      icon: <Award className="h-10 w-10 text-brand-gold" />,
      title: "Jugadores Frecuentes",
      description: "Si completas 3 misiones, obtén 50% de descuento en tu próxima inmersión.",
      delay: 0.4,
    },
    {
      icon: <Gift className="h-10 w-10 text-brand-gold" />,
      title: "Cumpleaños",
      description: "El cumpleañero juega GRATIS si viene con 4 amigos.",
      delay: 0.1,
    },
    {
      icon: <Users className="h-10 w-10 text-brand-gold" />,
      title: "Familias",
      description: "Ven con los tuyos y disfruta de un 20% de descuento en grupos familiares de al menos 3 personas.",
      delay: 0.2,
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-brand-gold" />,
      title: "Estudiantes",
      description: "Presenta tu carnet universitario o escolar y recibe 20% de descuento en cualquier sala (SOLO DE LUNES A JUEVES).",
      delay: 0.3,
    },
    
  ]

  return (
    <section id="promociones" className="py-12 md:py-20 bg-brand-dark relative w-full">
      <div className="absolute inset-0 bg-[url('/spookyback.jpg?height=800&width=1200')] bg-cover bg-center opacity-10 rounded-2xl"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            PROMOCIONES Y <span className="text-brand-gold">DESCUENTOS</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-2">
            Vive la experiencia más intensa de Lima con beneficios que solo los valientes descubren.
          </p>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-4"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {promotions.map((promo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: promo.delay }}
              className="bg-brand-blue/80 border border-brand-gold/20 rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 hover:border-brand-gold/50 transition-all duration-300"
            >
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-1 bg-brand-gold/20 rounded-full blur-sm"></div>
                <div className="relative bg-gray-900 p-4 rounded-full">{promo.icon}</div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                <p className="text-gray-400 mb-4">{promo.description}</p>
                <Button
                  variant="outline"
                  className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark text-xs sm:text-sm w-full md:w-auto"
                  asChild
                >
                  <Link href="/reservas">AGENDA Y OBTÉN TU DESCUENTO</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

