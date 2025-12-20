'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Reemplaza este ID con tu ID real del Pixel de Meta
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || 'TU_PIXEL_ID_AQUI';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

function MetaPixelTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Inicializar el Pixel de Meta
    if (typeof window !== 'undefined' && !window.fbq) {
      (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/es_ES/fbevents.js');

      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }, []);

  useEffect(() => {
    // Trackear cambios de página
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* NoScript fallback para usuarios sin JavaScript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

export function MetaPixel() {
  return (
    <Suspense fallback={null}>
      <MetaPixelTracking />
    </Suspense>
  );
}

// Funciones helper para eventos personalizados
export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};

export const trackCustomEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, data);
  }
};

// Eventos predefinidos comunes para Escape Room
export const MetaEvents = {
  // Evento cuando se visualiza una sala
  viewRoom: (roomName: string, roomId: number) => {
    trackEvent('ViewContent', {
      content_name: roomName,
      content_ids: [roomId.toString()],
      content_type: 'escape_room',
    });
  },

  // Evento cuando se inicia una reserva (botón de reservar)
  initiateReservation: (roomName: string, price: number) => {
    trackEvent('InitiateCheckout', {
      content_name: roomName,
      value: price,
      currency: 'PEN',
    });
  },

  // ✅ EVENTO SCHEDULE: Cuando el cliente completa la reserva (pendiente de aprobación)
  scheduleReservation: (roomName: string, price: number, reservationId: number) => {
    trackEvent('Schedule', {
      content_name: roomName,
      value: price,
      currency: 'PEN',
      content_ids: [reservationId.toString()],
      content_type: 'reservation',
      status: 'scheduled'
    });
  },

  // ✅ EVENTO PURCHASE: Cuando el admin confirma la reserva (venta real)
  completePurchase: (roomName: string, price: number, reservationId: number) => {
    trackEvent('Purchase', {
      content_name: roomName,
      value: price,
      currency: 'PEN',
      content_ids: [reservationId.toString()],
      content_type: 'confirmed_reservation',
    });
  },

  // Evento cuando se registra un equipo
  registerTeam: (teamName: string, roomName: string) => {
    trackCustomEvent('RegisterTeam', {
      team_name: teamName,
      room_name: roomName,
    });
  },

  // Evento cuando se contacta
  contact: (method: 'phone' | 'whatsapp' | 'email') => {
    trackEvent('Contact', {
      contact_method: method,
    });
  },

  // Evento cuando se ve el ranking
  viewRanking: () => {
    trackCustomEvent('ViewRanking');
  },
};
