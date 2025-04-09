"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Clock, Lock, Key } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Logo } from "@/components/ui/logo"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("inicio")
  const [countdown, setCountdown] = useState(30 * 60) // 60 minutos en segundos

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Detectar sección activa
      const sections = [
        "inicio",
        "como-funciona",
        "cuartos",
        "galeria",
        "promociones",
        "clasificacion",
        "reservas",
        "eventos",
        "blog",
        "faq",
        "contacto",
      ]

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

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Efecto para el contador regresivo
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) return 30 * 60
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menuElement = document.querySelector(".md\\:flex.items-center.space-x-6")
      if (menuElement && !menuElement.contains(event.target as Node)) {
        // No hacer nada, solo para desktop
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
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
    { name: "Promociones", href: "#promociones" },
    /*{ name: "Reservas", href: "/reservas" },*/
    { name: "Clasificación", href: "#clasificacion" },
    { name: "Eventos", href: "#eventos" },
    { name: "FAQ", href: "#faq" },
    { name: "Contacto", href: "#contacto" },
  ]

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href")
    if (href && href.startsWith("#")) {
      e.preventDefault()
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const headerHeight = 80 // Altura aproximada del header
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Actualizar la sección activa manualmente para evitar saltos
        setActiveSection(targetId)

        // Cerrar el menú después de hacer clic en un enlace
        setIsMenuOpen(false)
      }
    }
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" onClick={handleLinkClick}>
            <Image src="/logoencryp.png" alt="Logo Encryp" width={190} height={70} className="py-2 cursor-pointer" />
          </Link>



          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative whitespace-nowrap ${activeSection === item.href.replace("#", "")
                    ? "text-brand-gold"
                    : "text-white hover:text-brand-gold"
                    }`}
                  onClick={handleLinkClick}
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
            </div>
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
              <Link href="/reservas" className="flex items-center gap-2" onClick={handleLinkClick}>
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
              <SheetContent side="right" className="bg-brand-dark/95 border-brand-gold/50 w-[80vw] sm:max-w-sm p-0">
                <div className="flex flex-col h-full p-6">
                  <div className="flex items-center justify-between mb-8">
                    <Link href="/" onClick={(e) => {
                      handleLinkClick(e)
                      setIsMenuOpen(false)
                    }}>
                      <Image src="/logoencryp.png" alt="Logo Encryp" width={40} height={40} className="cursor-pointer" />
                    </Link>


                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                      <X className="h-6 w-6" />
                      <span className="sr-only">Cerrar menú</span>
                    </Button>
                  </div>
                  <nav className="flex flex-col space-y-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`text-lg font-medium transition-colors font-sans ${activeSection === item.href.replace("#", "")
                          ? "text-brand-gold"
                          : "text-white hover:text-brand-gold"
                          }`}
                        onClick={(e) => {
                          handleLinkClick(e)
                          setIsMenuOpen(false)
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
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
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link
                        href="/reservas"
                        className="flex items-center justify-center gap-2"
                        onClick={(e) => {
                          handleLinkClick(e)
                          setIsMenuOpen(false)
                        }}
                      >
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
      </div>
    </motion.header>
  )
}

