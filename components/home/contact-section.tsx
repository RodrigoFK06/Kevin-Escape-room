"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, useInView } from "framer-motion";
import emailjs from "emailjs-com";
import {
  Send,
  MapPin,
  CheckCircle,
  Key,
  AlertCircle,
} from "lucide-react";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ email?: string }>({});

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const { name, email, subject, message } = formValues;

    // Validación básica
    if (!name || !email || !subject || !message) {
      setErrors({ email: "Todos los campos son obligatorios." });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Email inválido." });
      setIsSubmitting(false);
      return;
    }

    try {
      await emailjs.send(
        "service_gvpnwjn", // ← reemplazar
        "template_lnjw36s", // ← reemplazar
        {
          name,
          email,
          subject,
          message,
        },
        "HgPDjJ0T82sSGGuVt" // ← reemplazar
      );

      setIsSuccess(true);
      setFormValues({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (error) {
      console.error("Error al enviar:", error);
      setErrors({ email: "Ocurrió un error al enviar. Intenta de nuevo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="contacto"
      className="py-16 md:py-24 bg-brand-dark relative w-full rounded-2xl mb-12"
    >
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
            ¿Tienes dudas o buscas una experiencia a medida? Escríbenos y nuestro equipo te guiará para planear tu próxima inmersión ENCRYPTED.
          </p>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Formulario */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
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
                  className="border-brand-gold text-brand-gold hover:bg-brand-gold/10 font-sans outline"
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
                      <Label htmlFor="name" className="font-sans">Nombre</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Tu nombre"
                        value={formValues.name}
                        onChange={handleChange}
                        required
                        className="bg-[#0a141f] border-brand-gold/30 focus:border-brand-gold/80 focus:ring-brand-gold/20 font-sans"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-sans">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formValues.email}
                        onChange={handleChange}
                        required
                        className={`bg-[#0a141f] border-brand-gold/30 focus:border-brand-gold/80 focus:ring-brand-gold/20 font-sans ${errors.email ? "border-red-500" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center font-sans">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="font-sans">Asunto</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Asunto del mensaje"
                      value={formValues.subject}
                      onChange={handleChange}
                      required
                      className="bg-[#0a141f] border-brand-gold/30 focus:border-brand-gold/80 focus:ring-brand-gold/20 font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-sans">Mensaje</Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formValues.message}
                      onChange={handleChange}
                      placeholder="Escribe tu mensaje aquí..."
                      required
                      className="w-full rounded-md border border-brand-gold/30 bg-[#0a141f] px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-brand-gold/20 focus-visible:border-brand-gold/80 font-sans resize-none"
                    />
                  </div>
                </motion.div>

                <div className="mt-4">
                  <Button type="submit" className="w-full group font-sans" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
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

          {/* Mapa */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-col gap-6 h-full"
          >
            <motion.div
              variants={itemVariants}
              className="bg-[#0a141f] border border-brand-gold/20 rounded-lg p-6 hover:border-brand-gold/40 transition-all duration-300 flex-1"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center font-display">
                <MapPin className="h-5 w-5 text-brand-gold mr-2" />
                Ubicación
              </h3>
              <p className="text-gray-300 mb-4 font-sans">Calle Chiclayo 209, Miraflores. Lima - Perú</p>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.9384817238944!2d-77.03094492406827!3d-12.118866943743288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c81e5f16e4a3%3A0x4b0f6a4e8e6f8b7c!2sCalle%20Chiclayo%20209%2C%20Miraflores%2015074!5e0!3m2!1ses!2spe!4v1732738800000!5m2!1ses!2spe"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


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