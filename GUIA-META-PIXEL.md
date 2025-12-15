# 📊 Guía de Implementación - Meta Pixel (Facebook Pixel)

## 🎯 ¿Qué es el Meta Pixel?

El Meta Pixel es un código de seguimiento que te permite:
- Medir la efectividad de tus campañas publicitarias
- Entender las acciones que toman los usuarios en tu sitio web
- Crear audiencias personalizadas para remarketing
- Optimizar tus anuncios para conversiones

---

## 📍 PASO 1: Obtener tu ID del Pixel de Meta

### Opción A: Desde Meta Business Suite
1. Ve a https://business.facebook.com
2. Selecciona tu cuenta publicitaria
3. En el menú lateral, haz clic en **"Administrador de eventos"** (Events Manager)
4. Haz clic en **"Conectar orígenes de datos"** → **"Web"**
5. Selecciona **"Meta Pixel"**
6. Dale un nombre a tu pixel (ej: "Encrypted Escape Room")
7. Copia el **ID del Pixel** (es un número de 15-16 dígitos)

### Opción B: Desde Administrador de Anuncios
1. Ve a https://www.facebook.com/ads/manager
2. Haz clic en el menú hamburguesa (☰)
3. Selecciona **"Administrador de eventos"**
4. Si ya tienes un pixel, lo verás listado con su ID
5. Si no, créalo con el botón **"Agregar"**

**Ejemplo de ID:** `123456789012345`

---

## 🔧 PASO 2: Configurar el Pixel en tu Proyecto

### 2.1. Editar el archivo `.env.local`

Ya he agregado la variable en tu archivo `.env.local`. Ahora solo debes reemplazar el valor:

```env
# Reemplaza TU_PIXEL_ID_AQUI con tu ID real del Pixel
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
```

**⚠️ IMPORTANTE:** 
- El ID debe ser solo números, sin comillas
- Después de cambiar esta variable, debes **reiniciar el servidor de desarrollo**

### 2.2. Reiniciar el Servidor

```bash
# Detén el servidor actual (Ctrl + C)
# Luego inicia nuevamente:
pnpm dev
```

---

## ✅ PASO 3: Verificar que el Pixel Funciona

### 3.1. Instalar Meta Pixel Helper (Extensión de Chrome)

1. Ve a Chrome Web Store
2. Busca **"Meta Pixel Helper"**
3. Instala la extensión oficial de Meta
4. Visita tu sitio web (http://localhost:3001)
5. Haz clic en el icono de la extensión
6. Deberías ver tu Pixel ID activo con una marca verde ✓

### 3.2. Verificar en el Administrador de Eventos

1. Ve al Administrador de Eventos en Meta
2. Selecciona tu Pixel
3. Ve a la pestaña **"Prueba de eventos"**
4. Deberías ver eventos **"PageView"** llegando en tiempo real

---

## 📊 PASO 4: Eventos Implementados

He implementado eventos automáticos y personalizados para tu Escape Room:

### Eventos Automáticos (Ya funcionan)
- ✅ **PageView** - Se activa en cada cambio de página

### Eventos Personalizados (Para agregar manualmente)

#### 1. Ver Detalles de una Sala
```typescript
import { MetaEvents } from '@/components/analytics/meta-pixel';

// Cuando un usuario ve los detalles de una sala
MetaEvents.viewRoom('El Paciente 136', 1);
```

#### 2. Iniciar Proceso de Reserva
```typescript
// Cuando un usuario hace clic en "Reservar"
MetaEvents.initiateReservation('El Paciente 136', 80.00);
```

#### 3. Completar una Reserva
```typescript
// Cuando se confirma una reserva exitosa
MetaEvents.completeReservation('El Paciente 136', 80.00, reservationId);
```

#### 4. Registrar un Equipo
```typescript
// Cuando se registra un equipo nuevo
MetaEvents.registerTeam('Los Detectives', 'El Paciente 136');
```

#### 5. Contacto
```typescript
// Cuando alguien hace clic en WhatsApp/Teléfono
MetaEvents.contact('whatsapp');
MetaEvents.contact('phone');
MetaEvents.contact('email');
```

#### 6. Ver Ranking
```typescript
// Cuando alguien ve la tabla de rankings
MetaEvents.viewRanking();
```

---

## 🎯 PASO 5: Ejemplos de Implementación

### Ejemplo 1: En la Página de Detalles de Sala

```typescript
'use client';

import { useEffect } from 'react';
import { MetaEvents } from '@/components/analytics/meta-pixel';

export default function RoomPage({ params }: { params: { id: string } }) {
  useEffect(() => {
    // Trackear cuando alguien ve los detalles de una sala
    MetaEvents.viewRoom('El Paciente 136', parseInt(params.id));
  }, [params.id]);

  return (
    // ... tu componente
  );
}
```

### Ejemplo 2: En el Botón de Reserva

```typescript
import { MetaEvents } from '@/components/analytics/meta-pixel';

function BookingButton() {
  const handleReserve = () => {
    // Trackear inicio de reserva
    MetaEvents.initiateReservation('El Paciente 136', 80.00);
    
    // Continuar con la lógica de reserva
    router.push('/reservas');
  };

  return (
    <Button onClick={handleReserve}>
      Reservar Ahora
    </Button>
  );
}
```

### Ejemplo 3: Después de Completar Reserva

```typescript
const handleReservationSuccess = async (data: any) => {
  try {
    const response = await fetch('/api/reservas/crear', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });

    const result = await response.json();

    if (result.success) {
      // ✨ Trackear conversión exitosa
      MetaEvents.completeReservation(
        roomName, 
        totalPrice, 
        result.reservationId
      );

      // Mostrar confirmación
      toast.success('¡Reserva confirmada!');
    }
  } catch (error) {
    console.error(error);
  }
};
```

---

## 🔍 PASO 6: Monitoreo y Optimización

### En el Administrador de Eventos

1. **Dashboard Principal:**
   - Ve cuántos eventos se están recibiendo
   - Identifica páginas con más tráfico
   - Detecta problemas de seguimiento

2. **Eventos Personalizados:**
   - Monitorea tus eventos custom (RegisterTeam, ViewRanking, etc.)
   - Crea embudos de conversión
   - Analiza el comportamiento de los usuarios

3. **Audiencias Personalizadas:**
   - Crea audiencias basadas en eventos
   - Por ejemplo: "Personas que vieron una sala pero no reservaron"
   - Usa estas audiencias para remarketing

### Crear Conversiones Personalizadas

1. En el Administrador de Eventos, ve a **"Conversiones personalizadas"**
2. Haz clic en **"Crear conversión personalizada"**
3. Ejemplos de conversiones útiles:
   - **Reserva Completada:** evento "Purchase"
   - **Inicio de Reserva:** evento "InitiateCheckout"
   - **Registro de Equipo:** evento personalizado "RegisterTeam"

---

## 📱 PASO 7: Eventos Avanzados (Opcional)

### Trackear Scroll en Página
```typescript
useEffect(() => {
  const handleScroll = () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent > 75) {
      trackCustomEvent('ScrollDepth75');
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### Trackear Tiempo en Página
```typescript
useEffect(() => {
  const startTime = Date.now();

  return () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    if (timeSpent > 30) {
      trackCustomEvent('TimeOnPage', { seconds: timeSpent });
    }
  };
}, []);
```

---

## 🚀 Archivos Creados/Modificados

### ✅ Archivos Nuevos:
- `components/analytics/meta-pixel.tsx` - Componente del Pixel + helpers

### ✅ Archivos Modificados:
- `app/layout.tsx` - Pixel agregado al layout principal
- `.env.local` - Variable de entorno para el Pixel ID

---

## 📋 Checklist de Implementación

- [ ] Obtener ID del Pixel de Meta Business Suite
- [ ] Agregar el ID en `.env.local`
- [ ] Reiniciar el servidor de desarrollo
- [ ] Instalar Meta Pixel Helper (extensión Chrome)
- [ ] Verificar que el pixel aparece activo (marca verde)
- [ ] Ver eventos "PageView" en el Administrador de Eventos
- [ ] Agregar eventos personalizados en páginas clave
- [ ] Crear conversiones personalizadas en Meta
- [ ] Probar eventos con usuarios reales
- [ ] Configurar campañas de remarketing

---

## ❓ Problemas Comunes

### El Pixel no aparece en Meta Pixel Helper
- ✅ Verifica que el ID en `.env.local` es correcto
- ✅ Reinicia el servidor después de cambiar `.env.local`
- ✅ Limpia el caché del navegador (Ctrl + Shift + R)

### Los eventos no llegan al Administrador
- ✅ Verifica que el Pixel está "Activo" en Meta
- ✅ Espera 5-10 minutos (puede haber delay)
- ✅ Revisa la consola del navegador por errores

### Eventos duplicados
- ✅ Asegúrate de no tener el pixel instalado dos veces
- ✅ Verifica que no estás importando `<MetaPixel />` en múltiples lugares

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación oficial: https://www.facebook.com/business/help/742478679120153
2. Usa Meta Pixel Helper para diagnosticar
3. Consulta en el Centro de Ayuda de Meta Business

---

## 🎉 ¡Listo!

Tu Pixel de Meta está configurado y listo para usar. Solo necesitas:
1. Obtener tu ID del Pixel
2. Agregarlo en `.env.local`
3. Reiniciar el servidor

Los eventos de PageView ya están funcionando automáticamente. Para eventos personalizados, usa los helpers de `MetaEvents` en las páginas correspondientes.
