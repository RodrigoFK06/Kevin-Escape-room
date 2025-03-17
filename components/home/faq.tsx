"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, AlertTriangle, Clock, Users, Lock, Key } from "lucide-react"

type FaqItem = {
  question: string
  answer: string
  icon: React.ReactNode
}

export function Faq() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const [faqs] = useState<FaqItem[]>([
    {
      question: "¿Qué pasa si llego tarde?",
      answer:
        "Es importante llegar 15 minutos antes de la hora reservada para recibir las instrucciones. Si llegas tarde, tu tiempo de juego se reducirá proporcionalmente, ya que las siguientes sesiones están programadas y no podemos extender tu tiempo.",
      icon: <Clock className="h-5 w-5 text-brand-gold" />,
    },
    {
      question: "¿Qué nivel de dificultad tienen los enigmas?",
      answer:
        "Nuestras salas combinan elementos de lógica, observación y deducción. El nivel de dificultad varía según la sala elegida. 'Código Enigma' y 'La Bóveda' tienen elementos más complejos, mientras que 'El Laboratorio' se enfoca más en la inmersión y la narrativa.",
      icon: <Key className="h-5 w-5 text-brand-gold" />,
    },
    {
      question: "¿Puedo cancelar o cambiar mi reserva?",
      answer:
        "Puedes cancelar o modificar tu reserva hasta 24 horas antes de la hora programada con un reembolso del 80%. Para cambios o cancelaciones con menos de 24 horas de anticipación, no se realizan reembolsos, pero puedes reprogramar tu visita para otra fecha pagando una penalidad del 20%.",
      icon: <AlertTriangle className="h-5 w-5 text-brand-gold" />,
    },
    {
      question: "¿Hay edad mínima para participar?",
      answer:
        "La edad mínima recomendada es de 14 años para 'El Laboratorio' y 16 años para 'Código Enigma' y 'La Bóveda' debido a su complejidad. Los menores de 18 años deben estar acompañados por un adulto responsable.",
      icon: <Users className="h-5 w-5 text-brand-gold" />,
    },
    {
      question: "¿Qué debo llevar?",
      answer:
        "Solo necesitas traer tu confirmación de reserva (digital o impresa) y una identificación. Te recomendamos usar ropa cómoda y no traer objetos de valor, ya que no nos hacemos responsables por pérdidas.",
      icon: <HelpCircle className="h-5 w-5 text-brand-gold" />,
    },
    {
      question: "¿Las salas son claustrofóbicas?",
      answer:
        "Nuestras salas tienen diferentes tamaños, pero todas cuentan con sistemas de seguridad y salidas de emergencia. Si sufres de claustrofobia severa, te recomendamos informarnos al momento de tu llegada para que nuestro personal esté atento a cualquier situación.",
      icon: <AlertTriangle className="h-5 w-5 text-brand-gold" />,
    },
    {
      question: "¿Puedo salir de la sala antes de completar el juego?",
      answer:
        "Sí, puedes abandonar el juego en cualquier momento si te sientes incómodo. Solo debes avisar a través de las cámaras de seguridad y nuestro personal te asistirá inmediatamente.",
      icon: <Lock className="h-5 w-5 text-brand-gold" />,
    },
  ])

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
      id="faq"
      className="py-16 md:py-24 bg-gradient-to-b from-brand-dark to-[#0a141f] relative w-full overflow-hidden rounded-2xl mb-12"
    >
      <div className="absolute inset-0 bg-[url('/fondo2.jpg?height=800&width=1200')] bg-cover bg-center opacity-5 rounded-2xl"></div>

      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-brand-gold/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-display">
            PREGUNTAS <span className="text-brand-gold">FRECUENTES</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-2 font-sans">
            Resolvemos tus dudas para que solo tengas que preocuparte por encontrar la llave y escapar a tiempo.
          </p>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-4"></div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          // Agregamos un ancho fijo en pantallas grandes: w-full en móviles, y 700px en desktop
          className="mx-auto w-full md:w-[700px]"
        >
          <Accordion type="single" collapsible className="space-y-4 md:space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className={`
                    bg-brand-dark border border-brand-gold/20 rounded-lg px-4 md:px-6 
                    hover:border-brand-gold/50 transition-all duration-300
                    ${hoveredIndex === index ? "shadow-lg shadow-brand-gold/10" : ""}
                  `}
                >
                  <AccordionTrigger className="text-left font-bold py-4 md:py-5 text-sm md:text-base font-sans">
                    <span className="flex items-center">
                      <span className="mr-3 flex-shrink-0">{faq.icon}</span>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4 md:pb-5 text-sm md:text-base font-sans">
                    <div className="pl-8">{faq.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          {/* Pregunta adicional con efecto especial */}
          <motion.div
            variants={itemVariants}
            className="mt-10 p-6 bg-brand-dark/80 border border-brand-gold/30 rounded-lg text-center"
          >
            <h3 className="text-xl font-bold mb-3 text-brand-gold font-display">¿Tienes más preguntas?</h3>
            <p className="text-gray-300 mb-4 font-sans">
              Contáctanos directamente y resolveremos todas tus dudas antes de que te enfrentes al desafío.
            </p>
            <motion.a
              href="#contacto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark font-bold py-2 px-4 rounded-lg group"
            >
              <Lock className="h-4 w-4 group-hover:hidden" />
              <Key className="h-4 w-4 hidden group-hover:block animate-key-turn" />
              Contáctanos
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
