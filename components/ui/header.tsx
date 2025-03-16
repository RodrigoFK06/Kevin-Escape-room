"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Menu, X, Clock, Lock, Key } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("inicio")
  const [countdown, setCountdown] = useState(60 * 60) // 60 minutos en segundos
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Detectar sección activa
      const sections = ["inicio", "cuartos", "reservas", "promociones", "clasificacion", "faq", "eventos", "contacto"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    // Manejar clics fuera del menú para cerrarlo
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    // Manejar tecla Escape para cerrar el menú
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscKey)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isMenuOpen])

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

  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Cuartos", href: "#cuartos" },
    { name: "Reservas", href: "#reservas" },
    { name: "Promociones", href: "#promociones" },
    { name: "Clasificación", href: "#clasificacion" },
    { name: "FAQ", href: "#faq" },
    { name: "Eventos", href: "#eventos" },
    { name: "Contacto", href: "#contacto" },
  ]

  const handleNavItemClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[90] transition-all duration-300 w-full",
        isScrolled ? "bg-brand-dark/90 backdrop-blur-sm border-b border-brand-gold/30" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Logo variant="full" className="py-2" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium hover:text-brand-gold transition-colors relative font-sans ${
                activeSection === item.href.replace("#", "") ? "text-brand-gold" : "text-white"
              }`}
            >
              {item.name}
              {activeSection === item.href.replace("#", "") && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-gold"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Contador regresivo */}
          <div className="hidden md:flex items-center bg-brand-dark/80 backdrop-blur-sm border border-brand-gold/30 rounded-lg px-3 py-1">
            <Clock className="h-4 w-4 text-brand-gold mr-2" />
            <span className={`text-sm font-mono ${countdown < 300 ? "text-red-500 animate-pulse" : "text-white"}`}>
              {formatTime(countdown)}
            </span>
          </div>

          <Button variant="default" size="lg" className="hidden sm:flex text-sm font-sans group" asChild>
            <Link href="#reservas" className="flex items-center gap-2">
              <Lock className="h-4 w-4 group-hover:hidden" />
              <Key className="h-4 w-4 hidden group-hover:block animate-key-turn" />
              RESERVA AHORA
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              ref={menuRef}
              side="right"
              className="bg-brand-dark/95 border-brand-gold/50 w-[80vw] sm:max-w-sm p-0 z-[100]"
              onInteractOutside={() => setIsMenuOpen(false)}
              onEscapeKeyDown={() => setIsMenuOpen(false)}
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                  <Logo variant="icon" iconClassName="w-8 h-8" />
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Cerrar menú</span>
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col space-y-6">
                  <AnimatePresence>
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className={`text-lg font-medium transition-colors font-sans ${
                            activeSection === item.href.replace("#", "")
                              ? "text-brand-gold"
                              : "text-white hover:text-brand-gold"
                          }`}
                          onClick={handleNavItemClick}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </nav>

                {/* Contador en móvil */}
                <div className="mt-6 flex items-center justify-center bg-brand-dark/80 backdrop-blur-sm border border-brand-gold/30 rounded-lg px-3 py-2">
                  <Clock className="h-4 w-4 text-brand-gold mr-2" />
                  <span
                    className={`text-sm font-mono ${countdown < 300 ? "text-red-500 animate-pulse" : "text-white"}`}
                  >
                    {formatTime(countdown)}
                  </span>
                </div>

                <div className="mt-auto pt-6">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full font-sans group"
                    asChild
                    onClick={handleNavItemClick}
                  >
                    <Link href="#reservas" className="flex items-center justify-center gap-2">
                      <Lock className="h-4 w-4 group-hover:hidden" />
                      <Key className="h-4 w-4 hidden group-hover:block animate-key-turn" />
                      RESERVA AHORA
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}

