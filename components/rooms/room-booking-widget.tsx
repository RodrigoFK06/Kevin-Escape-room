"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoomBookingWidgetProps {
  room: any
}

export function RoomBookingWidget({ room }: RoomBookingWidgetProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>("")
  const [players, setPlayers] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const timeSlots = [
    { id: "1", time: "15:00", available: true },
    { id: "2", time: "16:30", available: true },
    { id: "3", time: "18:00", available: false },
    { id: "4", time: "19:30", available: true },
    { id: "5", time: "21:00", available: true },
  ]

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

  const basePrice = 120
  const playerCount = Number.parseInt(players) || 2
  const totalPrice = basePrice * playerCount

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-brand-blue/50 border border-brand-gold/20 rounded-lg overflow-hidden horror-card"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 text-center">Reserva tu experiencia</h3>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-bold mb-2">¡Reserva Confirmada!</h4>
            <p className="text-gray-400 text-sm mb-4">
              Recibirás un correo electrónico con los detalles de tu reserva.
            </p>
            <Button
              variant="outline"
              className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark"
              onClick={() => setIsSuccess(false)}
            >
              Hacer otra reserva
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fecha */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <CalendarIcon className="h-4 w-4 text-brand-gold mr-2" />
                Fecha
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal horror-input",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Hora */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 text-brand-gold mr-2" />
                Hora
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={time === slot.id ? "default" : "outline"}
                    className={cn(
                      "text-xs horror-button",
                      !slot.available && "opacity-50 cursor-not-allowed",
                      time === slot.id && "bg-brand-gold text-brand-dark",
                    )}
                    disabled={!slot.available}
                    onClick={() => slot.available && setTime(slot.id)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Jugadores */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 text-brand-gold mr-2" />
                Número de jugadores
              </label>
              <Select value={players} onValueChange={setPlayers}>
                <SelectTrigger className="horror-input">
                  <SelectValue placeholder="Selecciona el número de jugadores" />
                </SelectTrigger>
                <SelectContent>
                  {room.players.split("-")[0] === "2" && <SelectItem value="2">2 jugadores</SelectItem>}
                  <SelectItem value="3">3 jugadores</SelectItem>
                  <SelectItem value="4">4 jugadores</SelectItem>
                  <SelectItem value="5">5 jugadores</SelectItem>
                  <SelectItem value="6">6 jugadores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resumen */}
            {players && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-brand-dark/60 p-4 rounded-lg border border-brand-gold/20"
              >
                <h4 className="text-sm font-medium mb-2">Resumen</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Precio por persona:</span>
                    <span>S/. {basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Número de jugadores:</span>
                    <span>{players}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-gray-700 mt-2">
                    <span>Total:</span>
                    <span className="text-brand-gold">S/. {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full horror-button"
              disabled={!date || !time || !players || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-brand-dark border-t-transparent"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Reservar Ahora
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">Pago seguro. Cancelación gratuita hasta 24h antes.</p>
          </form>
        )}
      </div>
    </motion.div>
  )
}

