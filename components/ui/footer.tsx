"use client"

import Link from "next/link"
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-brand-dark border-t border-brand-gold/30 pt-10 md:pt-12 pb-6 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Logo variant="full" className="group" />
            <p className="text-gray-400 text-sm font-sans">
              Descifra los enigmas. Encuentra las llaves. Escapa antes de que sea tarde.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-brand-gold transition-colors transform hover:scale-110 duration-300"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-brand-gold transition-colors transform hover:scale-110 duration-300"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-brand-gold transition-colors transform hover:scale-110 duration-300"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-white font-display">Enlaces rápidos</h3>
            <ul className="space-y-2">
              {[
                { name: "Cuartos de escape", href: "#cuartos" },
                { name: "Reservas", href: "#reservas" },
                { name: "Promociones", href: "#promociones" },
                { name: "Preguntas frecuentes", href: "#faq" },
                { name: "Eventos corporativos", href: "#eventos" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-gold transition-colors text-sm flex items-center group font-sans"
                  >
                    <ChevronRight className="h-3 w-3 mr-1 text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-white font-display">Horarios</h3>
            <ul className="space-y-2 text-sm text-gray-400 font-sans">
              <li className="flex justify-between">
                <span>Lunes a Jueves:</span>
                <span className="text-brand-gold">15:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Viernes:</span>
                <span className="text-brand-gold">15:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sábados:</span>
                <span className="text-brand-gold">11:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingos:</span>
                <span className="text-brand-gold">11:00 - 22:00</span>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-brand-dark/80 border border-brand-gold/20 rounded-lg text-xs text-gray-400 font-sans">
              <p className="flex items-start">
                <span className="text-brand-gold mr-1">*</span>
                Última entrada 90 minutos antes del cierre
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-white font-display">Contacto</h3>
            <ul className="space-y-3 font-sans">
              <li className="flex items-start gap-3 group">
                <MapPin className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5 group-hover:animate-pulse" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  Av. Ejemplo 123, Lima, Perú
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="h-5 w-5 text-brand-gold flex-shrink-0 group-hover:animate-pulse" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">+51 123 456 789</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="h-5 w-5 text-brand-gold flex-shrink-0 group-hover:animate-pulse" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  info@encrypted.com
                </span>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-brand-gold/10 border border-brand-gold/30 rounded-lg">
              <p className="text-xs text-white font-sans">
                ¿Tienes alguna pregunta? Escríbenos y te responderemos lo antes posible.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 mt-8 md:mt-10 pt-4 md:pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 font-sans">
            &copy; {currentYear} Encrypted Escape Room. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <Link href="#" className="text-xs text-gray-500 hover:text-brand-gold transition-colors font-sans">
              Términos y condiciones
            </Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-brand-gold transition-colors font-sans">
              Política de privacidad
            </Link>
          </div>
        </div>

        {/* Decoración */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"></div>
      </div>
    </footer>
  )
}

