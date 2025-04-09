// app/reservas/page.tsx
"use client";

import { Header } from "@/components/home/header";
import { Footer } from "@/components/ui/footer";
import ReservationSystem from "@/components/home/reservation-system";

export default function ReservasPage() {
  return (
    <>
      <Header />
      <main className="pt-[8rem] pb-12 px-4 bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto">
          <ReservationSystem />
        </div>
      </main>
      <Footer />
    </>
  );
}
