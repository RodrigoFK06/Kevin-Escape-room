// app/api/email/reserva/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import ReservationSystem from "@/components/home/reservation-system";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Body recibido:", body);

    const {
      cliente,
      correo,
      sala,
      fecha,
      hora,
      jugadores,
      metodo_pago,
      monto_total,
      monto_reserva,
      monto_restante,
      payment_option,
    } = body;



    if (!cliente || !correo) {
      console.error("Datos incompletos:", { cliente, correo });
      return NextResponse.json(
        { success: false, error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const html = `
  <div style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: #2c3e50; padding: 24px; max-width: 600px; margin: auto;">
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="https://www.encryptedperu.com/logoencryp.png" alt="Encrypted Escape Room" style="height: 60px;" />
    </div>

    <h2 style="color: #111; font-size: 22px;">🎉 ¡Tu reserva ha sido separada!</h2>
    <p>Hola <strong>${cliente}</strong>,</p>
    <p>Gracias por reservar en <strong>Encrypted Escape Room</strong>. Aquí tienes los detalles de tu experiencia:</p>

    <ul style="line-height: 1.7; margin-bottom: 24px;">
      <li><strong>Sala:</strong> ${sala}</li>
      <li><strong>Fecha:</strong> ${fecha}</li>
      <li><strong>Hora:</strong> ${hora}</li>
      <li><strong>Jugadores:</strong> ${jugadores}</li>
      <li><strong>Método de pago:</strong> ${metodo_pago}</li>
    </ul>

    <div style="background-color: #fff3cd; border-left: 5px solid #ffc107; padding: 16px; margin-bottom: 24px; border-radius: 6px;">
      <h3 style="margin: 0 0 12px 0; color: #d35400;">⚠️ Importante</h3>
      <p style="margin: 0 0 8px;">⏳ Tienes <strong>15 minutos</strong> para realizar el pago de tu reserva (S/. <strong>50.00</strong>) para asegurar tu cupo.</p>
      <p style="margin: 0 0 8px;">💰 <strong>Total a pagar tras la experiencia:</strong> <span style="color: #d35400;">S/. ${monto_total.toFixed(2)}</span> (${(Number(monto_total) / Number(jugadores)).toFixed(2)} por persona)</p>
      <p style="margin: 0 0 8px;">💵 <strong>Pagado ahora:</strong> S/. ${monto_reserva.toFixed(2)}</p>
      ${payment_option === "adelanto"
        ? `<p style="margin: 0 0 8px;">📌 <strong>Restante a pagar el día del juego:</strong> S/. ${monto_restante.toFixed(2)}</p>`
        : `<p style="margin: 0 0 8px;">✅ Has pagado el total por adelantado. ¡No necesitas pagar nada más el día del juego!</p>`}
      <p style="margin: 0;">🕓 Recomendamos llegar con <strong>al menos 20 minutos de anticipación</strong>.</p>
    </div>

    <div style="margin-bottom: 24px; line-height: 1.7;">
      <p>📤 <strong>Envía una foto del voucher a nuestro WhatsApp:</strong> <a href="https://wa.me/51981575968" style="color: #2d3436;">981 575 968</a></p>
      <p>📧 <strong>¿Dudas o consultas?</strong> Escríbenos a <a href="mailto:contacto@encryptedperu.com">contacto@encryptedperu.com</a></p>
      <p>📋 <strong>¿Necesitas factura?</strong> Ten en cuenta que se agregará el <strong>IGV (18%)</strong>.</p>
    </div>

    <p style="margin-bottom: 32px;">¡Gracias por elegir <strong>Encrypted</strong>! Te esperamos para vivir una experiencia inolvidable. 🧠🗝️</p>

    <hr style="margin: 24px 0; border: 1px dashed #ccc;" />
    <p style="color: #888; font-size: 12px; text-align: center;">Encrypted Escape Room | Lima, Perú</p>
  </div>
`;






    const sendResult = await transporter.sendMail({
      from: `Encrypted <${process.env.SMTP_USER}>`,
      to: correo,
      subject: "Tu reserva ha sido confirmada",
      html,
    });

    console.log("Correo enviado:", sendResult);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error al enviar correo:", error.message || error);
    return NextResponse.json(
      { success: false, error: "Error al enviar el correo" },
      { status: 500 }
    );
  }
}