"use client";

import { Header } from "@/components/home/header";
import { Footer } from "@/components/ui/footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { useToast } from "@/components/ui/use-toast";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  incidentDate: string;
  complaintType: string;
  message: string;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  incidentDate: "",
  complaintType: "",
  message: "",
};

export default function ReclamacionesPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFields = (): boolean => {
    const emptyFields = Object.entries(formData).filter(([_, value]) => !value.trim());
    if (emptyFields.length > 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    setIsSubmitting(true);
    try {
      await emailjs.send(
        "service_gvpnwjn",
        "template_1kfzh2o",
        {
          name: formData.name || "No especificado",
          email: formData.email || "No especificado",
          phone: formData.phone || "No especificado",
          subject: formData.subject || "No especificado",
          incidentDate: formData.incidentDate || "No especificado",
          complaintType: formData.complaintType || "No especificado",
          message: formData.message || "No especificado",
        },
        "HgPDjJ0T82sSGGuVt"
      );

      toast({
        title: "Reclamación enviada",
        description: "Tu reclamación ha sido enviada. Nos pondremos en contacto contigo.",
      });

      setFormData(initialFormData);
    } catch (error) {
      console.error("Error enviando reclamación:", error);
      toast({
        title: "Error",
        description: "Ocurrió un problema al enviar tu reclamación. Inténtalo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-[8rem] pb-12 px-4 bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-brand-gold">
            Libro de Reclamaciones
          </h1>
          <motion.form
            onSubmit={handleSubmit}
            className="bg-[#0a141f] border border-brand-gold/20 rounded-lg p-8 space-y-6 min-h-[600px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ingrese su nombre"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Ingrese su email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Ingrese su número de teléfono"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="subject">Asunto</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="¿Cuál es el tema de su reclamación?"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="incidentDate">Fecha del Incidente</Label>
              <Input
                id="incidentDate"
                name="incidentDate"
                type="date"
                value={formData.incidentDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="complaintType">Categoría de Reclamación</Label>
              <select
                id="complaintType"
                name="complaintType"
                value={formData.complaintType}
                onChange={handleChange}
                className="w-full p-2 border border-brand-gold/30 rounded bg-[#0a141f] text-white"
              >
                <option value="" disabled>Seleccione una categoría</option>
                <option value="producto">Producto</option>
                <option value="servicio">Servicio</option>
                <option value="atencion">Atención</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div>
              <Label htmlFor="message">Mensaje o Reclamación</Label>
              <textarea
                id="message"
                name="message"
                rows={8}
                placeholder="Describa detalladamente su reclamación..."
                className="w-full p-2 border border-brand-gold/30 rounded bg-[#0a141f] text-white"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Reclamación"}
              </Button>
            </div>
          </motion.form>
        </div>
      </main>
      <Footer />
    </>
  );
}
