# 📊 Guía de Implementación - Meta Pixel (Facebook Pixel)

## 🎯 ¿Qué es el Meta Pixel?

El Meta Pixel es un código de seguimiento que te permite:
- Medir la efectividad de tus campañas publicitarias
- Entender las acciones que toman los usuarios en tu sitio web
- Crear audiencias personalizadas para remarketing
- Optimizar tus anuncios para conversiones
- **Medir ROI real**: Diferencia entre reservas solicitadas (`Schedule`) y ventas confirmadas (`Purchase`)

---

## 📍 PASO 1: Obtener tu ID del Pixel de Meta

### Opción A: Desde Meta Business Suite

1. Ve a **Meta Business Suite**: https://business.facebook.com
2. En el menú lateral, busca **"Administrador de eventos"** o **"Event Manager"**
3. Haz clic en **"Pixeles"** en el menú de la izquierda
4. Si ya tienes un Pixel creado:
   - Verás tu Pixel ID (un número de 15-16 dígitos)
   - Ejemplo: `123456789012345`
5. Si NO tienes un Pixel:
   - Haz clic en **"Agregar"** → **"Crear un Pixel"**
   - Sigue los pasos para crear tu Pixel
   - Una vez creado, copia el **Pixel ID**

### Opción B: Desde Ads Manager

1. Ve a **Facebook Ads Manager**: https://www.facebook.com/adsmanager
2. Haz clic en el **menú de hamburguesa** (☰) arriba a la izquierda
3. Selecciona **"Administrador de eventos"**
4. Busca **"Fuentes de datos"** → **"Pixeles"**
5. Copia el **Pixel ID** de 15-16 dígitos

---

## 🔧 PASO 2: Configurar el Pixel ID en tu proyecto

1. Abre el archivo **`.env.local`** en la raíz de tu proyecto
2. Busca la línea que dice:
   ```bash
   NEXT_PUBLIC_META_PIXEL_ID=TU_PIXEL_ID_AQUI
   ```
3. Reemplaza `TU_PIXEL_ID_AQUI` con tu Pixel ID real:
   ```bash
   NEXT_PUBLIC_META_PIXEL_ID=123456789012345
   ```
4. **Guarda el archivo**
5. **Reinicia el servidor de desarrollo**:
   ```bash
   # Detén el servidor (Ctrl + C) y vuelve a iniciarlo
   pnpm dev
   ```

---

## ✅ PASO 3: Verificar que el Pixel funciona

### Método 1: Meta Pixel Helper (Recomendado)

1. Instala la extensión **"Meta Pixel Helper"** para Chrome:
   - https://chrome.google.com/webstore (busca "Meta Pixel Helper")
2. Abre tu sitio web en Chrome
3. Haz clic en el icono de la extensión
4. Deberías ver:
   - ✅ **Pixel activo** con tu ID
   - ✅ Evento **PageView** disparado automáticamente

### Método 2: Desde Meta Business Suite

1. Ve a **Administrador de eventos** → Tu Pixel
2. Haz clic en **"Probar eventos"**
3. Ingresa la URL de tu sitio web
4. Navega por tu sitio y verás los eventos en tiempo real

---

## 📊 PASO 4: Flujo de Eventos Implementados

### 🎯 Sistema Completo de Tracking de Conversión

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE RESERVAS                        │
└─────────────────────────────────────────────────────────────┘

1️⃣ CLIENTE HACE RESERVA (/reservas)
   └─> Evento: Schedule
       ├─ value: S/ 110 (monto total)
       ├─ currency: PEN
       ├─ status: scheduled
       └─ Estado: PENDIENTE (amarillo)

2️⃣ ADMIN REVISA (/admin/reservas)
   └─> Clic en botón "Confirmar" (✓)
       └─> Evento: Purchase
           ├─ value: S/ 110 (monto total)
           ├─ currency: PEN
           ├─ content_type: confirmed_reservation
           └─ Estado: CONFIRMADA (verde)

📈 MÉTRICAS EN META ADS:
   • Total de Schedule = Reservas solicitadas
   • Total de Purchase = Ventas reales
   • Tasa de conversión = (Purchase / Schedule) × 100
   • ROI correcto en PEN (Soles)
```

### Eventos Automáticos

1. **`PageView`** - Se dispara automáticamente en cada página
   - Sin configuración adicional
   - Tracking de navegación completo

### Eventos Implementados

2. **`Schedule`** - Cuando el cliente completa su reserva ✅
   ```typescript
   // Se dispara automáticamente al crear reserva
   MetaEvents.scheduleReservation(
     "El Paciente 136",  // Nombre de la sala
     110,                // Precio total
     42                  // ID de la reserva
   );
   ```
   **Parámetros:**
   - `content_name`: Nombre de la sala reservada
   - `value`: Monto total de la reserva
   - `currency`: **PEN** (Soles peruanos)
   - `content_ids`: ID único de la reserva
   - `status`: 'scheduled' (pendiente de confirmación)

3. **`Purchase`** - Cuando el admin confirma la reserva ✅
   ```typescript
   // Se dispara automáticamente al confirmar en admin
   MetaEvents.completePurchase(
     "El Paciente 136",  // Nombre de la sala
     110,                // Precio total
     42                  // ID de la reserva
   );
   ```
   **Parámetros:**
   - `content_name`: Nombre de la sala
   - `value`: Monto total confirmado
   - `currency`: **PEN** (Soles peruanos)
   - `content_ids`: ID de la reserva
   - `content_type`: 'confirmed_reservation'

### Eventos Adicionales (Manuales)

4. **`ViewContent`** - Ver detalles de una sala
   ```typescript
   MetaEvents.viewRoom("El Paciente 136", 1);
   ```

5. **`InitiateCheckout`** - Iniciar proceso de reserva
   ```typescript
   MetaEvents.initiateReservation("El Paciente 136", 110);
   ```

6. **`Contact`** - Contactar por WhatsApp/Teléfono
   ```typescript
   MetaEvents.contact('whatsapp');
   ```

7. **`RegisterTeam`** - Registrar equipo para ranking
   ```typescript
   MetaEvents.registerTeam("Los Enigmáticos", "El Paciente 136");
   ```

---

## 📈 PASO 5: Ver métricas en Meta Ads

### En Administrador de Eventos

1. Ve a **Administrador de eventos** → Tu Pixel
2. Selecciona **"Actividad"** o **"Dashboard"**
3. Verás gráficas de:
   - **Schedule**: Total de reservas solicitadas
   - **Purchase**: Total de ventas confirmadas
   - **Conversion Rate**: % de reservas que se confirman
   - **Revenue**: Ingresos totales en PEN

### En Ads Manager (Campañas)

1. Crea una campaña con objetivo **"Conversiones"**
2. Selecciona el evento de conversión:
   - **Schedule** para optimizar por reservas solicitadas
   - **Purchase** para optimizar por ventas confirmadas
3. Facebook optimizará automáticamente tus anuncios
4. Verás el **ROI real** calculado en soles (PEN)

### Crear Audiencias Personalizadas

1. Ve a **Audiencias** en Ads Manager
2. Clic en **"Crear audiencia"** → **"Audiencia personalizada"**
3. Selecciona **"Sitio web"**
4. Elige tu Pixel y crea reglas como:
   - Personas que dispararon evento **Schedule** (reservaron)
   - Personas que NO dispararon **Purchase** (no confirmaron)
   - Personas que vieron salas específicas

---

## 🔍 Solución de Problemas

### El Pixel no aparece en Meta Pixel Helper

**Causa:** El ID del Pixel está mal configurado o el servidor no se reinició

**Solución:**
1. Verifica que el `.env.local` tenga el ID correcto
2. Reinicia el servidor: `Ctrl+C` y luego `pnpm dev`
3. Limpia caché del navegador: `Ctrl+Shift+Del`
4. Recarga la página: `Ctrl+R` o `F5`

### Los eventos no aparecen en Meta Business Suite

**Causa:** Puede tomar unos minutos en aparecer

**Solución:**
1. Espera 5-10 minutos (los eventos no son instantáneos)
2. Verifica que el evento se disparó en la consola del navegador:
   ```javascript
   // Abre DevTools (F12) → Console
   // Deberías ver mensajes de fbq
   ```
3. Usa **"Probar eventos"** en el Administrador de eventos

### El evento Schedule no se dispara

**Causa:** Error en la creación de la reserva o datos faltantes

**Solución:**
1. Abre DevTools (F12) → Console
2. Busca errores en rojo
3. Verifica que la reserva se creó exitosamente en `/admin/reservas`
4. El evento solo se dispara si `response.ok === true`

### El evento Purchase no se dispara

**Causa:** El admin no confirmó correctamente o hay error en la actualización

**Solución:**
1. Verifica que el botón "Confirmar" (✓) cambió el estado a "Confirmada"
2. Abre DevTools → Console para ver errores
3. El evento solo se dispara cuando `nuevoEstado === 'confirmada'`

### Los valores monetarios están en dólares (USD) en lugar de soles (PEN)

**Causa:** Meta Ads convierte automáticamente según la configuración de la cuenta

**Solución:**
1. Los eventos ya envían `currency: 'PEN'` correctamente
2. Ve a **Configuración de cuenta** en Meta Ads
3. Verifica que tu **moneda de cuenta** sea PEN (Nuevo Sol Peruano)
4. Los reportes mostrarán valores en soles

---

## 📝 Checklist Final

- [ ] Copié mi Pixel ID de Meta Business Suite
- [ ] Actualicé el `.env.local` con mi Pixel ID real
- [ ] Reinicié el servidor de desarrollo
- [ ] Verifiqué el Pixel con Meta Pixel Helper
- [ ] Probé hacer una reserva de prueba (evento Schedule)
- [ ] Confirmé la reserva desde admin (evento Purchase)
- [ ] Vi ambos eventos en "Probar eventos" de Meta Business Suite
- [ ] Configuré una campaña de conversiones en Ads Manager

---

## 🎯 Beneficios de esta Implementación

✅ **ROI Preciso**: Diferencia entre reservas solicitadas y ventas confirmadas  
✅ **Moneda Correcta**: Todos los valores en PEN (Soles)  
✅ **Optimización Automática**: Facebook optimiza anuncios por conversiones reales  
✅ **Remarketing Inteligente**: Audiencias de personas que reservaron pero no confirmaron  
✅ **Métricas Reales**: Tasa de conversión de Schedule → Purchase  
✅ **Sin Configuración Manual**: Los eventos se disparan automáticamente  

---

## 📞 Soporte

Si tienes problemas con la implementación:

1. **Documentación oficial de Meta**: https://developers.facebook.com/docs/meta-pixel
2. **Consola del navegador**: `F12` → Console para ver errores
3. **Meta Pixel Helper**: Extensión de Chrome para debugging
4. **Administrador de eventos**: Herramienta de "Probar eventos" en vivo

---

**¡Listo!** 🎉 Tu Meta Pixel está completamente configurado y listo para medir el ROI de tus campañas de Facebook Ads con datos precisos en soles peruanos.

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
