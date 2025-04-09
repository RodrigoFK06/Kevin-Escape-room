// app/reclamaciones/page.tsx
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

export default function ReclamacionesPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    incidentDate: "",
    complaintType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.subject ||
      !formData.incidentDate ||
      !formData.complaintType ||
      !formData.message
    ) {
      toast({
        title: "Error",
        description: "Complete todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await emailjs.send(
        "your_service_id",
        "your_complaint_template_id",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          incidentDate: formData.incidentDate,
          complaintType: formData.complaintType,
          message: formData.message
        },
        "your_user_id"
      );
      toast({
        title: "Reclamación enviada",
        description: "Tu reclamación ha sido enviada. Nos pondremos en contacto contigo.",
        variant: "default"
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        incidentDate: "",
        complaintType: "",
        message: ""
      });
    } catch (error) {
      console.error("Error enviando reclamación:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar la reclamación. Inténtalo de nuevo.",
        variant: "destructive"
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
                <Label htmlFor="name" className="mb-1">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  placeholder="Ingrese su nombre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email" className="mb-1">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingrese su email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="mb-1">
                Teléfono
              </Label>
              <Input
                id="phone"
                placeholder="Ingrese su número de teléfono"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="subject" className="mb-1">
                Asunto
              </Label>
              <Input
                id="subject"
                placeholder="¿Cuál es el tema de su reclamación?"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="incidentDate" className="mb-1">
                Fecha del Incidente
              </Label>
              <Input
                id="incidentDate"
                type="date"
                value={formData.incidentDate}
                onChange={(e) =>
                  setFormData({ ...formData, incidentDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="complaintType" className="mb-1">
                Categoría de Reclamación
              </Label>
              <select
                id="complaintType"
                value={formData.complaintType}
                onChange={(e) =>
                  setFormData({ ...formData, complaintType: e.target.value })
                }
                className="w-full p-2 border border-brand-gold/30 rounded bg-[#0a141f] text-white"
              >
                <option value="" disabled>
                  Seleccione una categoría
                </option>
                <option value="producto">Producto</option>
                <option value="servicio">Servicio</option>
                <option value="atencion">Atención</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div>
              <Label htmlFor="message" className="mb-1">
                Mensaje o Reclamación
              </Label>
              <textarea
                id="message"
                rows={8}
                placeholder="Describa detalladamente su reclamación..."
                className="w-full p-2 border border-brand-gold/30 rounded bg-[#0a141f] text-white"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              ></textarea>
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
