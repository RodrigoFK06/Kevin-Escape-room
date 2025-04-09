// app/terminos/page.tsx
import { Header } from "@/components/home/header";
import SplashCursor from "@/components/ui/splashcursor";
import { Footer } from "@/components/ui/footer";

export default function TerminosPage() {
  return (
    <>
      <Header />
      <SplashCursor />
      <main className="pt-[8rem] pb-12 px-4 bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-brand-gold">
            TÉRMINOS Y CONDICIONES
          </h1>
          <article className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">1. GENERALIDADES</h2>
              <p>
                Encrypted ofrece experiencias inmersivas de escape room donde los participantes deben resolver
                acertijos y retos dentro de un entorno temático, con un tiempo límite de 60 minutos. La actividad
                está diseñada para promover la colaboración, la lógica y la resolución de problemas en equipo.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">2. EDAD MÍNIMA</h2>
              <p>
                La edad mínima para participar es de 15 años. Si el grupo incluye menores de edad, estos deberán
                estar acompañados por al menos un adulto responsable, quien asumirá la responsabilidad del grupo durante
                toda la experiencia.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">3. CANTIDAD DE PARTICIPANTES</h2>
              <p>
                Cada sala está diseñada para equipos de mínimo 2 y máximo 5 jugadores. En caso de desear participar con 6
                personas o más, la solicitud estará sujeta a disponibilidad. Para ello, será necesario comunicarse
                previamente por WhatsApp al <strong>+51 999 999 999</strong>, donde se brindará información sobre
                condiciones, horarios y tarifas aplicables.
              </p>
              <p>
                Encrypted se reserva el derecho de aceptar o rechazar estas solicitudes según aforo y operatividad del día.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">4. DURACIÓN DE LA EXPERIENCIA</h2>
              <p>
                La duración total del juego es de 60 minutos. Se solicita llegar con al menos 10 minutos de anticipación.
                Un retraso mayor a 15 minutos será considerado como ausencia (no show), sin derecho a reembolso ni
                reprogramación.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">5. POLÍTICAS DE PAGO Y DESCUENTOS</h2>
              <ul className="list-disc ml-5 space-y-2">
                <li>Las reservas requieren un adelanto mínimo de S/50.00 para ser válidas.</li>
                <li>El adelanto deberá abonarse dentro de un plazo máximo de 1 hora tras realizar la solicitud.</li>
                <li>Para reservas en fines de semana, este plazo se reduce a 30 minutos.</li>
                <li>
                  De no realizarse el pago en el tiempo estipulado, la reserva se anulará automáticamente para permitir
                  su disponibilidad a otros usuarios.
                </li>
                <li>
                  El saldo restante debe abonarse en su totalidad en el local antes de iniciar el juego.
                </li>
                <li>Los descuentos o promociones no son acumulables entre sí.</li>
                <li>Si se requiere factura, se informa que los precios publicados no incluyen IGV.</li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">6. POLÍTICAS DE CANCELACIÓN Y REPROGRAMACIÓN</h2>
              <ul className="list-disc ml-5 space-y-2">
                <li>Las reservas confirmadas son no reembolsables.</li>
                <li>Reprogramaciones solicitadas con más de 24 horas de anticipación no generan penalidad.</li>
                <li>
                  Reprogramaciones con menos de 24 horas de anticipación están sujetas a disponibilidad y generarán una
                  penalidad fija de S/50.00.
                </li>
                <li>
                  En caso de ausencia o retraso mayor a 15 minutos, la reserva se dará por cancelada sin derecho a
                  reembolso ni reprogramación.
                </li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">7. POLÍTICA DE INGRESO CON ALIMENTOS</h2>
              <p>
                Está prohibido ingresar al local con alimentos, snacks, bocaditos, piqueos, bebidas o tortas. Si se desea
                celebrar una ocasión especial, el cliente debe consultar previamente por los paquetes de celebración o el
                alquiler del lobby, los cuales están sujetos a disponibilidad.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">8. CONDUCTA DURANTE EL JUEGO</h2>
              <ul className="list-disc ml-5 space-y-2">
                <li>No se permite el uso de fuerza física para resolver enigmas.</li>
                <li>No se debe manipular violentamente ningún objeto del juego.</li>
                <li>Está prohibido el ingreso bajo efectos de alcohol o sustancias ilegales.</li>
                <li>
                  El uso de celulares, cámaras o cualquier equipo de grabación dentro de la sala está totalmente prohibido.
                </li>
                <li>El incumplimiento de las normas puede resultar en la expulsión del grupo sin reembolso.</li>
                <li>
                  En caso de daño a la infraestructura o componentes del juego, el equipo será responsable por el costo de
                  reposición o reparación.
                </li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">9. USO DE IMAGEN Y AUDIOVISUALES</h2>
              <p>
                Durante su participación en Encrypted, es posible que se tomen fotografías o videos grupales como parte de la
                experiencia. Dicho material podrá ser utilizado con fines promocionales y de difusión en nuestros canales
                oficiales, tales como redes sociales, página web u otros medios de comunicación vinculados a nuestra marca. Al
                aceptar estos términos, el participante autoriza el uso de su imagen para dichos fines.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">10. CONFIDENCIALIDAD</h2>
              <p>
                Todos los elementos del juego (retos, mecánicas, narrativa, ambientación) son propiedad intelectual de Encrypted. Se
                prohíbe divulgar detalles de las salas para proteger la experiencia de futuros jugadores. El incumplimiento de
                esta cláusula puede conllevar medidas legales.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-gold mb-4">11. RESPONSABILIDAD</h2>
              <p>
                Encrypted no se hace responsable por pérdidas de objetos personales o accidentes durante el desarrollo del juego.
                El ingreso y la participación se realizan bajo responsabilidad del cliente. Las salas son monitoreadas en todo
                momento para garantizar la seguridad.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
