"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, useInView } from "framer-motion"
import { Send, MapPin, Phone, Mail, CheckCircle, Key } from "lucide-react"

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Resetear después de 3 segundos
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1500)
  }

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
    <section
      id="contacto"
      className="py-16 md:py-24 bg-brand-dark relative w-full rounded-2xl mb-12"
      // Eliminamos overflow-hidden para que nada se corte en móvil
    >
      {/* Fondo lobo */}
      <div className="absolute inset-0 bg-[url('/lobo.svg?height=800&width=1200')] bg-cover bg-center opacity-5 rounded-2xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-display">
            CONTACTA <span className="text-brand-gold">CON NOSOTROS</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-2 font-sans">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
          </p>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-4"></div>
        </motion.div>

        {/* Grid principal (form + bloque derecho) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Columna Izquierda: Form */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            // Para que ocupe la altura y coincida con mapa
            className="flex flex-col h-full"
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0a141f] border border-brand-gold/20 rounded-lg p-8 text-center flex-1 flex flex-col items-center justify-center"
              >
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 font-display">¡Mensaje Enviado!</h3>
                <p className="text-gray-400 mb-6 font-sans">
                  Gracias por contactarnos. Te responderemos lo antes posible.
                </p>
                <Button
                  variant="outline"
                  className="border-brand-gold text-brand-gold hover:bg-brand-gold/10 font-sans"
                  onClick={() => setIsSuccess(false)}
                >
                  Enviar otro mensaje
                </Button>
              </motion.div>
            ) : (
              <motion.form
                variants={containerVariants}
                onSubmit={handleSubmit}
                className="bg-[#0a141f] border border-brand-gold/20 rounded-lg p-6 md:p-8 hover:border-brand-gold/40 transition-all duration-300 flex-1 flex flex-col"
              >
                <motion.div variants={itemVariants} className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-sans">
                        Nombre
                      </Label>
                      <Input
                        id="name"
                        placeholder="Tu nombre"
                        required
                        className="bg-[#0a141f] border-brand-gold/30 focus:border-brand-gold/80 focus:ring-brand-gold/20 font-sans"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-sans">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        className="bg-[#0a141f] border-brand-gold/30 focus:border-brand-gold/80 focus:ring-brand-gold/20 font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="font-sans">
                      Asunto
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Asunto de tu mensaje"
                      required
                      className="bg-[#0a141f] border-brand-gold/30 focus:border-brand-gold/80 focus:ring-brand-gold/20 font-sans"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <Label htmlFor="message" className="font-sans">
                      Mensaje
                    </Label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Escribe tu mensaje aquí..."
                      required
                      className="w-full h-full rounded-md border border-brand-gold/30 bg-[#0a141f] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/20 focus-visible:border-brand-gold/80 disabled:cursor-not-allowed disabled:opacity-50 font-sans resize-none"
                    />
                  </div>
                </motion.div>

                <div className="mt-4">
                  <Button type="submit" className="w-full group font-sans" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-brand-dark border-t-transparent"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4 group-hover:hidden" />
                        <Key className="mr-2 h-4 w-4 hidden group-hover:block animate-key-turn" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          </motion.div>

          {/* Columna Derecha */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            // Estructura en 2 sub-bloques: Mapa arriba + 2 col layout para Info y Horarios
            className="flex flex-col gap-6 h-full"
          >
            {/* Mapa */}
            <motion.div
              variants={itemVariants}
              className="bg-[#0a141f] border border-brand-gold/20 rounded-lg p-6 hover:border-brand-gold/40 transition-all duration-300 flex-1 flex flex-col"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center font-display">
                <MapPin className="h-5 w-5 text-brand-gold mr-2" />
                Ubicación
              </h3>
              <p className="text-gray-300 mb-4 font-sans">Av. Ejemplo 123, Lima, Perú</p>
              <div className="relative flex-1 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.964216405086!2d-77.03196684957949!3d-12.046654991455207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8b5d35662c7%3A0x15f8dcc0194c8eb4!2sPlaza%20Mayor%20de%20Lima!5e0!3m2!1ses-419!2spe!4v1625160044500!5m2!1ses-419!2spe"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0"
                />
              </div>
            </motion.div>

            {/* 2-col layout: Info de Contacto + Horarios 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <motion.div
                variants={itemVariants}
                className="bg-[#0a141f] border border-brand-gold/20 rounded-lg p-6 hover:border-brand-gold/40 transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4 font-display">Información de Contacto</h3>
                <ul className="space-y-4 font-sans">
                  <li className="flex items-start gap-3 group">
                    <Phone className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5 group-hover:animate-pulse" />
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <p className="text-gray-400">+51 123 456 789</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <Mail className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5 group-hover:animate-pulse" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-400">info@encrypted.com</p>
                    </div>
                  </li>
                </ul>
              </motion.div>

              
              <motion.div
                variants={itemVariants}
                className="bg-[#0a141f] border border-brand-gold/20 rounded-lg p-6 hover:border-brand-gold/40 transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4 font-display">Horarios de Atención</h3>
                <ul className="space-y-2 font-sans">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Lunes a Jueves:</span>
                    <span>15:00 - 22:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Viernes:</span>
                    <span>15:00 - 23:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Sábados:</span>
                    <span>11:00 - 23:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Domingos:</span>
                    <span>11:00 - 22:00</span>
                  </li>
                </ul>
              </motion.div>
            </div>*/}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
