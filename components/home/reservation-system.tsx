"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CreditCard,
  Smartphone,
  Clock,
  Users,
  Lock,
  Key,
  CheckCircle,
  AlertCircle,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { DatePicker } from "@/components/ui/date-picker";
import { fetchHorariosDisponibles } from "@/lib/api-horarios";
import { useToast } from "@/components/ui/use-toast";

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

function ReservationSystem() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [players, setPlayers] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRoomPreview, setShowRoomPreview] = useState(false);
  const [selectedRoomImage, setSelectedRoomImage] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Inicialmente el cronómetro NO arranca; se definirá cuando se seleccione el método de pago
  const [countdown, setCountdown] = useState(15 * 60);

  // UseEffect para iniciar el cronómetro solo cuando se haya seleccionado un método de pago
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paymentMethod) {
      setCountdown(15 * 60); // Reinicia a 15 minutos
      timer = setInterval(() => {
        setCountdown((prev) => (prev <= 0 ? 0 : prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [paymentMethod]);

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  const roomImages = {
    "codigo-enigma": "/placeholder.svg?height=800&width=1200",
    "la-boveda": "/placeholder.svg?height=800&width=1200",
    "el-laboratorio": "/placeholder.svg?height=800&width=1200",
  };

  const roomIds: Record<string, number> = {
    "codigo-enigma": 1,
    "la-boveda": 2,
    "el-laboratorio": 3,
  };

  const roomPrices: Record<string, number> = {
    "codigo-enigma": 120,
    "la-boveda": 100,
    "el-laboratorio": 150,
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
    setSelectedRoomImage(roomImages[roomId as keyof typeof roomImages]);
    setShowRoomPreview(true);
    setDate(undefined);
    setAvailableTimes([]);
    setSelectedTime("");

    try {
      const audio = new Audio("/placeholder.mp3");
      audio.volume = 0.3;
      audio.play().catch((err) => {
        console.log("Autoplay bloqueado:", err);
      });
    } catch (error) {
      console.error("Error al reproducir audio:", error);
    }

    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
    }
    previewTimerRef.current = setTimeout(() => {
      setShowRoomPreview(false);
    }, 2000);
  };

  const handleDateSelect = async (selected: Date | undefined) => {
    setDate(selected);
    setSelectedTime("");
    if (!selectedRoom || !selected) return;
    const formatted = format(selected, "yyyy-MM-dd");
    try {
      const response = await fetchHorariosDisponibles(roomIds[selectedRoom].toString(), formatted);
      const { horarios, ocupados } = response;
      const final = horarios.map((h: any) => ({
        id: h.id,
        time: h.hora,
        available: !ocupados.includes(h.id),
      }));
      setAvailableTimes(final);
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      setAvailableTimes([]);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!selectedRoom) newErrors.room = "Selecciona una sala";
      if (!date) newErrors.date = "Selecciona una fecha";
      if (!selectedTime) newErrors.time = "Selecciona un horario";
    } else if (step === 2) {
      if (!name.trim()) newErrors.name = "Ingresa tu nombre";
      if (!phone.trim()) newErrors.phone = "Ingresa tu teléfono";
      if (!email.trim()) {
        newErrors.email = "Ingresa tu email";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email inválido";
      }
      if (!players) newErrors.players = "Selecciona el número de jugadores";
    } else if (step === 3) {
      if (!paymentMethod) newErrors.payment = "Selecciona un método de pago";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, complete los campos obligatorios.",
        variant: "destructive",
      });
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setIsSubmitting(true);
    try {
      const horarioId = parseInt(selectedTime, 10);
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const pricePerPerson = roomPrices[selectedRoom] || 120;
      const total = players ? Number(players) * pricePerPerson : 0;
      const body = {
        reserva: {
          cliente: name,
          correo: email,
          telefono: phone,
          horario_id: horarioId,
          fecha: formattedDate,
          cantidad_jugadores: Number(players),
          metodo_pago: paymentMethod,
          precio_total: total,
          estado: "confirmada",
        },
      };
      const response = await fetch("/api/reservas/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("Error al crear la reserva");
      }
      setIsSuccess(true);
      toast({
        title: "¡Reserva exitosa!",
        description: "Tu reserva ha sido confirmada.",
      });
    } catch (error) {
      console.error("Error en la reserva:", error);
      setErrors({ form: "Ocurrió un error inesperado" });
      toast({
        title: "Error",
        description: "Hubo un problema al crear la reserva. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(formStep + 1);
    }
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="reservas" className="py-16 md:py-24 bg-brand-dark relative w-full my-12">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-5 rounded-2xl"></div>
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#0a141f]/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0a141f]/20 to-transparent"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 font-display">
            SISTEMA DE <span className="text-brand-gold">RESERVAS</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-2 text-sm md:text-base font-sans">
            Reserva tu experiencia en pocos pasos. Selecciona fecha, hora y sala para comenzar tu desafío.
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto px-2 text-sm md:text-base font-sans">
            * Recuerda que para reservar solo necesitas un abono de S/. 50.00 por equipo *
          </p>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-3 md:mt-4"></div>
        </motion.div>
  
        <div className="max-w-4xl mx-auto">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="bg-[#0a141f] border border-brand-gold/20 rounded-lg p-4 md:p-8 hover:border-brand-gold/40 transition-all duration-300"
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8 md:py-16"
              >
                <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-white font-display">
                  ¡Reserva Separada!
                </h3>
                <p className="text-gray-400 mb-6 font-sans text-sm md:text-base">
                  * No olvides enviar tu comprobante de pago al WhatsApp o correo de Encrypted *
                </p>
                <p className="text-gray-400 mb-6 font-sans text-sm md:text-base">
                  Recibirás un correo electrónico con los detalles de tu reserva. ¡Prepárate para el desafío!
                </p>
                <div className="bg-brand-dark/50 border border-brand-gold/30 rounded-lg p-4 max-w-md mx-auto mb-6">
                  <h4 className="font-bold text-brand-gold mb-2 font-sans">Detalles de tu reserva:</h4>
                  <ul className="text-left space-y-2 text-sm text-gray-300 font-sans">
                    <li className="flex justify-between">
                      <span>Sala:</span>
                      <span className="font-medium">
                        {selectedRoom === "codigo-enigma"
                          ? "Código Enigma"
                          : selectedRoom === "la-boveda"
                          ? "La Bóveda"
                          : selectedRoom === "el-laboratorio"
                          ? "El Laboratorio"
                          : ""}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Fecha:</span>
                      <span className="font-medium">{date ? format(date, "PPP", { locale: es }) : ""}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Hora:</span>
                      <span className="font-medium">
                        {availableTimes.find((slot) => slot.id === selectedTime)?.time || ""}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Jugadores:</span>
                      <span className="font-medium">{players}</span>
                    </li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  className="border-brand-gold text-brand-gold hover:bg-brand-gold/10 font-sans h-12"
                  onClick={() => {
                    setIsSuccess(false);
                    setFormStep(1);
                    setSelectedRoom("");
                    setSelectedTime("");
                    setPaymentMethod("");
                    setName("");
                    setPhone("");
                    setEmail("");
                    setPlayers("");
                    setDate(undefined);
                    setErrors({});
                  }}
                >
                  Hacer otra reserva
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="flex justify-between mb-6 md:mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          formStep >= step ? "bg-brand-gold text-brand-dark" : "bg-brand-dark/50 text-gray-400"
                        } transition-colors duration-300`}
                      >
                        {step}
                      </div>
                      <div className="text-xs mt-1 text-gray-400 font-sans hidden sm:block">
                        {step === 1 ? "Sala y Fecha" : step === 2 ? "Datos" : "Pago"}
                      </div>
                      <div className="text-xs mt-1 text-gray-400 font-sans sm:hidden">
                        {step === 1 ? "Sala" : step === 2 ? "Datos" : "Pago"}
                      </div>
                    </div>
                  ))}
                </div>
  
                {formStep === 1 && (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <AnimatePresence>
                      {showRoomPreview && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
                          onClick={() => {
                            if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
                            setShowRoomPreview(false);
                          }}
                        >
                          <motion.div
                            initial={{ scale: 0.8, rotateY: 90 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            exit={{ scale: 0.8, rotateY: -90 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            className="relative w-full max-w-4xl aspect-video"
                            style={{ perspective: 1000 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Image
                              src={selectedRoomImage || "/placeholder.svg"}
                              alt="Vista previa de la sala"
                              fill
                              className="object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
  
                    <div className="space-y-3 md:space-y-4">
                      <Label htmlFor="room" className="text-base md:text-lg font-medium flex items-center font-sans">
                        <Key className="mr-2 h-5 w-5 text-brand-gold" />
                        Selecciona una sala
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { id: "codigo-enigma", name: "Código Enigma", difficulty: "Difícil" },
                          { id: "la-boveda", name: "La Bóveda", difficulty: "Extremo" },
                          { id: "el-laboratorio", name: "El Laboratorio", difficulty: "Medio" },
                        ].map((room) => (
                          <motion.button
                            key={room.id}
                            type="button"
                            onClick={() => handleRoomSelect(room.id)}
                            className={cn(
                              "relative group overflow-hidden rounded-lg border p-5 transition-all duration-300 h-auto",
                              selectedRoom === room.id
                                ? "border-brand-gold bg-brand-gold/20"
                                : "border-brand-gold/30 hover:border-brand-gold/60 hover:bg-brand-gold/10"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="relative z-10">
                              <h3 className="font-bold text-lg mb-1">{room.name}</h3>
                              <p className="text-sm text-gray-400">{room.difficulty}</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          </motion.button>
                        ))}
                      </div>
                      {errors.room && (
                        <p className="text-red-500 text-xs mt-1 flex items-center font-sans">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.room}
                        </p>
                      )}
                    </div>
  
                    <div className="space-y-3 md:space-y-4 mt-6">
                      <Label htmlFor="date" className="text-base md:text-lg font-medium flex items-center font-sans">
                        <CalendarIcon className="mr-2 h-5 w-5 text-brand-gold" />
                        Selecciona una fecha
                      </Label>
                      <DatePicker date={date} onSelect={handleDateSelect} error={Boolean(errors.date)} />
                      {errors.date && (
                        <p className="text-red-500 text-xs mt-1 flex items-center font-sans">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.date}
                        </p>
                      )}
                    </div>
  
                    <motion.div variants={itemVariants} className="space-y-3 md:space-y-4 mt-6">
                      <Label className="text-base md:text-lg font-medium flex items-center font-sans">
                        <Clock className="mr-2 h-5 w-5 text-brand-gold" />
                        Selecciona un horario
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                        {availableTimes.length === 0 ? (
                          <div className="col-span-full w-full max-w-sm mx-auto text-center">
                            <p className="text-gray-400 text-xs mt-1">
                              No hay horarios disponibles para la fecha seleccionada.
                            </p>
                          </div>
                        ) : (
                          availableTimes.map((slot) => (
                            <Button
                              key={slot.id}
                              type="button"
                              variant={selectedTime === slot.id ? "default" : "outline"}
                              className={cn(
                                "flex items-center justify-center text-xs sm:text-sm group font-sans py-3 h-auto",
                                !slot.available && "opacity-50 cursor-not-allowed",
                                selectedTime === slot.id && "bg-brand-gold text-brand-dark",
                                "border-brand-gold/30 hover:bg-brand-gold/10"
                              )}
                              disabled={!slot.available}
                              onClick={() => slot.available && setSelectedTime(slot.id)}
                            >
                              <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                              {slot.time.slice(0, 5)}
                              {!slot.available && <Lock className="ml-1 h-3 w-3" />}
                            </Button>
                          ))
                        )}
                      </div>
                      {errors.time && (
                        <p className="text-red-500 text-xs mt-1 flex items-center font-sans">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.time}
                        </p>
                      )}
                    </motion.div>
  
                    <motion.div variants={itemVariants} className="mt-8 flex justify-end">
                      <Button type="button" onClick={nextStep} className="group font-sans h-12">
                        <span className="mr-2">Siguiente</span>
                        <Lock className="h-4 w-4 group-hover:hidden" />
                        <Key className="h-4 w-4 hidden group-hover:block animate-key-turn" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
  
                {formStep === 2 && (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2 md:space-y-4">
                        <Label htmlFor="name" className="text-base md:text-lg font-medium font-sans">
                          Nombre completo
                        </Label>
                        <Input
                          id="name"
                          placeholder="Ingresa tu nombre completo"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={cn(
                            "bg-[#0a141f] border-brand-gold/30 focus:border-brand-gold/80 focus:ring-brand-gold/20 font-sans h-12",
                            errors.name && "border-red-500"
                          )}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1 flex items-center font-sans">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2 md:space-y-4">
                        <Label htmlFor="phone" className="text-base md:text-lg font-medium font-sans">
                          Teléfono
                        </Label>
                        <Input
                          id="phone"
                          placeholder="Ingresa tu número de teléfono"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={cn(
                            "bg-[#0a141f] border-brand-gold/30 focus:border-brand-gold/80 focus:ring-brand-gold/20 font-sans h-12",
                            errors.phone && "border-red-500"
                          )}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1 flex items-center font-sans">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2 md:space-y-4">
                        <Label htmlFor="email" className="text-base md:text-lg font-medium font-sans">
                          Correo electrónico
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Ingresa tu correo electrónico"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={cn(
                            "bg-[#0a141f] border-brand-gold/30 focus:border-brand-gold/80 focus:ring-brand-gold/20 font-sans h-12",
                            errors.email && "border-red-500"
                          )}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1 flex items-center font-sans">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2 md:space-y-4">
                        <Label htmlFor="players" className="text-base md:text-lg font-medium flex items-center font-sans">
                          <Users className="mr-2 h-5 w-5 text-brand-gold" />
                          Número de jugadores
                        </Label>
                        <Select value={players} onValueChange={setPlayers}>
                          <SelectTrigger
                            id="players"
                            className={cn(
                              "bg-[#0a141f] border-brand-gold/30 focus:border-brand-gold/80 focus:ring-brand-gold/20 font-sans h-12",
                              errors.players && "border-red-500"
                            )}
                          >
                            <SelectValue placeholder="Selecciona el número de jugadores" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0a141f] border-brand-gold/30">
                            <SelectItem value="2">2 jugadores</SelectItem>
                            <SelectItem value="3">3 jugadores</SelectItem>
                            <SelectItem value="4">4 jugadores</SelectItem>
                            <SelectItem value="5">5 jugadores</SelectItem>
                            <SelectItem value="6">6 jugadores</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.players && (
                          <p className="text-red-500 text-xs mt-1 flex items-center font-sans">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.players}
                          </p>
                        )}
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="mt-8 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep} className="font-sans h-12">
                        Anterior
                      </Button>
                      <Button type="button" onClick={nextStep} className="group font-sans h-12">
                        <span className="mr-2">Siguiente</span>
                        <Lock className="h-4 w-4 group-hover:hidden" />
                        <Key className="h-4 w-4 hidden group-hover:block animate-key-turn" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
  
                {formStep === 3 && (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <motion.div variants={itemVariants} className="space-y-3 md:space-y-4">
                      <Label className="text-base md:text-lg font-medium flex items-center font-sans">
                        <CreditCard className="mr-2 h-5 w-5 text-brand-gold" />
                        Método de pago
                      </Label>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
                      >
                        <label
                          htmlFor="yape"
                          className={cn(
                            "flex items-center space-x-2 border border-brand-gold/20 rounded-md p-4 cursor-pointer hover:border-brand-gold/50 transition-colors",
                            paymentMethod === "yape" && "bg-brand-gold/10 border-brand-gold/50",
                            errors.payment && "border-red-500"
                          )}
                        >
                          <RadioGroupItem value="yape" id="yape" className="hidden" />
                          <span className="flex items-center text-sm md:text-base font-sans">
                            <Smartphone className="mr-2 h-4 w-4 md:h-5 md:w-5 text-brand-gold" />
                            <Smartphone className="mr-2 h-4 w-4 md:h-5 md:w-5 text-brand-gold" />
                            Yape / Plin
                          </span>
                        </label>
                        <label
                          htmlFor="local"
                          className={cn(
                            "flex items-center space-x-2 border border-brand-gold/20 rounded-md p-4 cursor-pointer hover:border-brand-gold/50 transition-colors",
                            paymentMethod === "local" && "bg-brand-gold/10 border-brand-gold/50",
                            errors.payment && "border-red-500"
                          )}
                        >
                          <RadioGroupItem value="local" id="local" className="hidden" />
                          <span className="cursor-pointer text-sm md:text-base font-sans">
                            Transferencia bancaria
                          </span>
                        </label>
                      </RadioGroup>
                      {errors.payment && (
                        <p className="text-red-500 text-xs mt-1 flex items-center font-sans">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.payment}
                        </p>
                      )}
                    </motion.div>
  
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="mt-4 space-y-4">
                      {paymentMethod === "yape" && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Image
                              src="/placeholder.svg"
                              alt="Código QR Yape"
                              width={400}
                              height={400}
                              className="rounded-lg border border-brand-gold/30"
                            />
                            <Image
                              src="/placeholder.svg"
                              alt="Código QR Plin"
                              width={400}
                              height={400}
                              className="rounded-lg border border-brand-gold/30"
                            />
                          </div>
                          <div className="flex items-center justify-between bg-brand-dark/70 p-3 rounded-md border border-brand-gold/30">
                            <p className="text-sm text-white font-sans">Tiempo para realizar el pago:</p>
                            <span className="text-white font-sans font-semibold">{formatTime(countdown)}</span>
                          </div>
                        </>
                      )}
  
                      {paymentMethod === "local" && (
                        <>
                          <div className="bg-brand-dark/50 border border-brand-gold/30 rounded-lg p-4 text-sm text-white font-sans leading-relaxed">
                            <p className="mb-2 text-brand-gold font-semibold">Transferencia Bancaria</p>
                            <p>
                              <span className="text-gray-400">Cuenta BCP Soles:</span>{" "}
                              <strong>57007192985095</strong>
                            </p>
                            <p>
                              <span className="text-gray-400">Cuenta interbancaria:</span>{" "}
                              <strong>00257010719298509506</strong>
                            </p>
                          </div>
                          <div className="flex items-center justify-between bg-brand-dark/70 p-3 rounded-md border border-brand-gold/30">
                            <p className="text-sm text-white font-sans">Tiempo para realizar la reserva:</p>
                            <span className="text-white font-sans font-semibold">{formatTime(countdown)}</span>
                          </div>
                        </>
                      )}
                    </motion.div>
  
                    <motion.div variants={itemVariants} className="mt-8 p-4 border border-brand-gold/30 rounded-lg bg-brand-dark/50">
                      <h3 className="text-lg font-bold mb-3 text-brand-gold font-display">Resumen de tu reserva</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm font-sans">
                        <div className="text-gray-400">Sala:</div>
                        <div className="font-medium text-white">
                          {selectedRoom === "codigo-enigma"
                            ? "Código Enigma"
                            : selectedRoom === "la-boveda"
                            ? "La Bóveda"
                            : selectedRoom === "el-laboratorio"
                            ? "El Laboratorio"
                            : ""}
                        </div>
                        <div className="text-gray-400">Fecha:</div>
                        <div className="font-medium text-white">{date ? format(date, "PPP", { locale: es }) : ""}</div>
                        <div className="text-gray-400">Hora:</div>
                        <div className="font-medium text-white">
                          {availableTimes.find((slot) => slot.id === selectedTime)?.time || ""}
                        </div>
                        <div className="text-gray-400">Jugadores:</div>
                        <div className="font-medium text-white">{players}</div>
                        <div className="text-gray-400">Precio total por persona:</div>
                        <div className="font-medium text-brand-gold">S/. {(roomPrices[selectedRoom] || 120).toFixed(2)}</div>
                        <div className="text-gray-400">Precio para reservar:</div>
                        <div className="font-medium text-brand-gold">S/. 50</div>
                        <div className="text-gray-400 font-bold">Total:</div>
                        <div className="font-bold text-brand-gold text-lg">
                          S/. {players ? (Number.parseInt(players) * (roomPrices[selectedRoom] || 120)).toFixed(2) : "0.00"}
                        </div>
                      </div>
                    </motion.div>
  
                    <motion.div variants={itemVariants} className="mt-8 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep} className="font-sans h-12">
                        Anterior
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="group font-sans h-12">
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-brand-dark border-t-transparent"></div>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <span className="mr-2">Confirmar Reserva</span>
                            <Lock className="h-4 w-4 group-hover:hidden" />
                            <Key className="h-4 w-4 hidden group-hover:block animate-key-turn" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
  
                <motion.p variants={itemVariants} className="text-xs text-gray-500 text-center font-sans">
                  Al realizar la reserva, aceptas nuestros términos y condiciones.
                  <br />
                  Recibirás una confirmación por correo electrónico y un recordatorio en Google Calendar.
                </motion.p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
  
export default ReservationSystem;
