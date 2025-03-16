"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Lock, Key } from "lucide-react"

export function HeroSection() {
  const [remainingSlots, setRemainingSlots] = useState(2)
  const [countdown, setCountdown] = useState(60 * 60) // 60 minutos en segundos

  // Simular urgencia con un contador que disminuye
  useEffect(() => {
    const timer = setTimeout(() => {
      if (remainingSlots > 1) {
        setRemainingSlots(remainingSlots - 1)
      }
    }, 60000) // Disminuye cada minuto

    return () => clearTimeout(timer)
  }, [remainingSlots])

  // Efecto para el contador regresivo
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) return 60 * 60
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Formatear el tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute("href")
    if (href && href.startsWith("#")) {
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        const headerHeight = 80 // Altura aproximada del header
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    }
  }

  return (
    <section className="relative w-screen h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark/50 z-10"></div>
        <div className="absolute inset-0 bg-[url('/2151626660.jpg?height=1080&width=1920')] bg-cover bg-center bg-no-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/50 to-brand-dark z-10"></div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">

        {/* Contenido Hero centrado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 font-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block">Descifra Resuelve Escapa</span>
            <span className="block text-brand-gold">¿Podrás salir a tiempo?</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white mb-6 md:mb-8 max-w-2xl mx-auto px-2 font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Adéntrate en nuestras salas de escape donde cada enigma te acerca a la libertad. El tiempo corre. La llave
            espera.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              variant="default"
              size="lg"
              className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 group font-sans"
              asChild
            >
              <Link href="#reservas" className="flex items-center gap-2" onClick={handleLinkClick}>
                <Lock className="h-5 w-5 group-hover:hidden" />
                <Key className="h-5 w-5 hidden group-hover:block animate-key-turn" />
                RESERVA AHORA
              </Link>
            </Button>

            <motion.p
              className="text-sm font-medium text-brand-gold font-sans"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
              }}
            >
              ¡Solo quedan {remainingSlots} horarios para hoy!
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Contador fijo */}
      <motion.div
        className="fixed left-4 bottom-4 z-[100] hidden md:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="bg-brand-dark/80 backdrop-blur-sm border border-brand-gold/30 rounded-lg p-3">
          <div className="text-brand-gold text-xs font-mono">TIEMPO RESTANTE</div>
          <div className="text-white text-2xl font-mono">{formatTime(countdown)}</div>
        </div>
      </motion.div>
    </section>

  )
}

