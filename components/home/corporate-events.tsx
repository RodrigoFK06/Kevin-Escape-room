"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import { Briefcase, Gift, Users, Check, Building, Calendar, Award } from "lucide-react"

export function CorporateEvents() {
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
    <section id="eventos" className="py-12 md:py-20 bg-brand-dark relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-5"></div>

      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-brand-blue/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-brand-blue/20 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 horror-title">
            EVENTOS <span className="text-brand-gold">CORPORATIVOS</span> Y CUMPLEAÑOS
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-2">
            Experiencias personalizadas para grupos, empresas y celebraciones especiales.
          </p>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-4"></div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {/* Team Building */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="bg-brand-blue border border-brand-gold/20 rounded-lg overflow-hidden hover:border-brand-gold/50 transition-all duration-300 group horror-card"
          >
            <div className="relative h-48 md:h-56 overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Team Building"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent"></div>
              <div className="absolute top-4 left-4 bg-brand-gold/90 text-brand-dark px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <Building className="h-3 w-3 mr-1" />
                CORPORATIVO
              </div>
              <div className="absolute bottom-4 left-4">
                <Briefcase className="h-10 w-10 text-brand-gold" />
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-gold transition-colors">
                Team Building Corporativo
              </h3>
              <p className="text-gray-400 mb-4">
                Desafía a tu equipo en una experiencia única que fortalecerá la comunicación, el liderazgo y el trabajo
                en equipo.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Exclusividad de las instalaciones</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Análisis de desempeño del equipo</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Catering y servicios adicionales</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark horror-button"
                asChild
              >
                <Link href="#reservas">Solicitar Información</Link>
              </Button>
            </div>
          </motion.div>

          {/* Cumpleaños */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="bg-brand-blue border border-brand-gold/20 rounded-lg overflow-hidden hover:border-brand-gold/50 transition-all duration-300 group horror-card"
          >
            <div className="relative h-48 md:h-56 overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Cumpleaños"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent"></div>
              <div className="absolute top-4 left-4 bg-brand-gold/90 text-brand-dark px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                CELEBRACIÓN
              </div>
              <div className="absolute bottom-4 left-4">
                <Gift className="h-10 w-10 text-brand-gold" />
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-gold transition-colors">
                Celebraciones y Cumpleaños
              </h3>
              <p className="text-gray-400 mb-4">
                Celebra tu cumpleaños en una experiencia inolvidable con tus amigos. Una alternativa única para
                festejar.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-400">El cumpleañero juega gratis (min. 4 personas)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Decoración temática de terror</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Área para torta y celebración</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark horror-button"
                asChild
              >
                <Link href="#reservas">Reservar Celebración</Link>
              </Button>
            </div>
          </motion.div>

          {/* Gift Cards */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="bg-brand-blue border border-brand-gold/20 rounded-lg overflow-hidden hover:border-brand-gold/50 transition-all duration-300 group horror-card"
          >
            <div className="relative h-48 md:h-56 overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Gift Cards"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent"></div>
              <div className="absolute top-4 left-4 bg-brand-gold/90 text-brand-dark px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <Award className="h-3 w-3 mr-1" />
                REGALO
              </div>
              <div className="absolute bottom-4 left-4">
                <Users className="h-10 w-10 text-brand-gold" />
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-gold transition-colors">Gift Cards</h3>
              <p className="text-gray-400 mb-4">
                Regala una experiencia de terror y adrenalina. La gift card perfecta para los amantes del misterio y el
                suspenso.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Válida por 6 meses</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Diseño personalizado</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Envío digital o físico</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark horror-button"
                asChild
              >
                <Link href="#reservas">Comprar Gift Card</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Sección de estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 text-center"
        >
          <div className="bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/20 rounded-lg p-4 horror-card">
            <div className="text-3xl font-bold text-brand-gold mb-2 horror-text">+50</div>
            <p className="text-gray-300 text-sm">Empresas confían en nosotros</p>
          </div>

          <div className="bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/20 rounded-lg p-4 horror-card">
            <div className="text-3xl font-bold text-brand-gold mb-2 horror-text">+200</div>
            <p className="text-gray-300 text-sm">Eventos corporativos</p>
          </div>

          <div className="bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/20 rounded-lg p-4 horror-card">
            <div className="text-3xl font-bold text-brand-gold mb-2 horror-text">+500</div>
            <p className="text-gray-300 text-sm">Cumpleaños celebrados</p>
          </div>

          <div className="bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/20 rounded-lg p-4 horror-card">
            <div className="text-3xl font-bold text-brand-gold mb-2 horror-text">98%</div>
            <p className="text-gray-300 text-sm">Satisfacción garantizada</p>
          </div>
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-brand-dark/80 backdrop-blur-sm border border-brand-gold/30 rounded-lg p-8 max-w-3xl mx-auto horror-card">
            <h3 className="text-2xl font-bold mb-4 text-brand-gold horror-text">¿LISTO PARA UNA EXPERIENCIA ÚNICA?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Ya sea para fortalecer tu equipo de trabajo o celebrar una ocasión especial, nuestras salas de escape
              ofrecen una experiencia inolvidable. Contáctanos para diseñar un evento a tu medida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="destructive" size="lg" className="horror-button" asChild>
                <Link href="#reservas">RESERVAR AHORA</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark horror-button"
                asChild
              >
                <Link href="#contacto">CONTACTAR</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

