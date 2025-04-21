// app/api/email/reserva/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      cliente,
      correo,
      sala,
      fecha,
      hora,
      jugadores,
      metodo_pago,
      monto_total,
    } = body;

    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net", // o smtp.tudominio.com
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const html = `
  <div style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: #2c3e50; padding: 24px; background-color: #fdfdfd;">
    <h2 style="color: #111; font-size: 22px;">🔒 ¡Reserva preventiva confirmada!</h2>
    <p>Hola <strong>${cliente}</strong>,</p>
    <p>
      ¡Gracias por reservar tu aventura con <strong>Encrypted Escape Room</strong>! Esta es una <strong>confirmación preventiva</strong> de tu reserva.
      Para asegurarla definitivamente, por favor realiza el pago correspondiente antes de que expire el tiempo límite.
    </p>

    <div style="margin: 20px 0; padding: 16px; background-color: #fef8e7; border-left: 4px solid #f6b73c;">
      <strong>Importante:</strong> Si no se realiza el pago en el plazo indicado, la reserva será cancelada automáticamente y el horario quedará disponible para otros usuarios.
    </div>

    <h3 style="margin-top: 24px; font-size: 18px; color: #111;">🧩 Detalles de tu reserva</h3>
    <ul style="line-height: 1.7; list-style: none; padding-left: 0;">
      <li><strong>Sala:</strong> ${sala}</li>
      <li><strong>Fecha:</strong> ${fecha}</li>
      <li><strong>Hora:</strong> ${hora}</li>
      <li><strong>Jugadores:</strong> ${jugadores}</li>
      <li><strong>Método de pago:</strong> ${metodo_pago}</li>
      <li><strong>Monto:</strong> S/. ${parseFloat(monto_total).toFixed(2)}</li>
    </ul>

    <h3 style="margin-top: 24px; font-size: 18px; color: #111;">📌 Recomendaciones</h3>
    <ul style="line-height: 1.7; padding-left: 20px;">
      <li>Llega al local <strong>20 minutos antes</strong> para una experiencia sin contratiempos.</li>
      <li>El equipo debe estar completo y listo para jugar en el horario pactado.</li>
      <li>El juego tiene una duración aproximada de 60 minutos, ¡prepárate para descifrarlo todo!</li>
    </ul>

    <div style="margin-top: 32px; padding: 20px; background: #0a141f; border-radius: 8px; color: #f5f5f5;">
      <p style="font-size: 16px; margin-bottom: 8px;"><strong>🔐 Encrypted Escape Room</strong></p>
      <p style="font-size: 14px;">Sumérgete en desafíos únicos, salas ambientadas al detalle y una historia que te atrapará desde el primer segundo.</p>
    </div>

    <hr style="margin: 32px 0; border: 0; border-top: 1px dashed #ccc;" />

    <p style="font-size: 12px; color: #999;">
      Este correo ha sido enviado automáticamente. Para más información o cambios en tu reserva, contáctanos a través de WhatsApp o por correo electrónico.
    </p>
  </div>
`;


    await transporter.sendMail({
      from: `Encrypted <${process.env.SMTP_USER}>`,
      to: correo,
      subject: "Tu reserva ha sido confirmada",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return NextResponse.json(
      { success: false, error: "Error al enviar el correo" },
      { status: 500 }
    );
  }
}
