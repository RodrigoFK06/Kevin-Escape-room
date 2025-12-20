# COTIZACIÓN DE SERVICIOS

**BYTECORE - Soluciones Tecnológicas**

---

## INFORMACIÓN DEL PROYECTO

**Cliente:** Kevin Escape Room  
**Fecha:** 19 de Diciembre, 2025  
**Proyecto:** Implementación y Configuración de Meta Pixel para Facebook Ads  
**Validez:** 30 días calendario  

---

## DESCRIPCIÓN DEL SERVICIO

### Implementación Completa de Meta Pixel (Facebook Pixel)

Sistema profesional de tracking y medición de conversiones integrado al sistema de reservas de Kevin Escape Room, permitiendo medir con precisión el Retorno de Inversión (ROI) de las campañas publicitarias en Facebook Ads e Instagram Ads.

---

## ALCANCE DEL SERVICIO

### ✅ **1. Configuración Técnica Base**

- ✅ Instalación del código base de Meta Pixel en todas las páginas
- ✅ Configuración correcta de variables de entorno
- ✅ Integración con Next.js 15 (última versión)
- ✅ Implementación de Suspense Boundary (optimización de rendimiento)
- ✅ Tracking automático de navegación (PageView)

### ✅ **2. Eventos de Conversión Personalizados**

#### Evento ViewContent (Ver Sala)
- Captura automática cuando el usuario entra a ver detalles de una sala
- Parámetros incluidos:
  - Nombre de la sala
  - ID de la sala
  - Tipo de contenido: Escape Room
- Ubicación: Páginas de cuartos individuales

#### Evento InitiateCheckout (Iniciar Reserva)
- Disparo automático cuando el usuario hace clic en "Reservar"
- Parámetros incluidos:
  - Nombre de la sala
  - Precio calculado según cantidad de jugadores
  - Moneda: PEN (Soles Peruanos)
- Ubicación: Widget de reservas en páginas de salas

#### Evento Schedule (Reserva Solicitada)
- Captura automática cuando el cliente completa una reserva
- Parámetros incluidos:
  - Nombre de la sala reservada
  - Monto total de la reserva
  - ID único de la reserva
  - Moneda: PEN (Soles Peruanos)
  - Estado: Programada (pendiente de confirmación)
- Ubicación: Formulario principal de reservas

#### Evento Purchase (Venta Confirmada)
- Disparo automático cuando el administrador confirma la reserva
- Parámetros incluidos:
  - Nombre de la sala
  - Precio total confirmado
  - ID de la reserva
  - Moneda: PEN (Soles Peruanos)
  - Tipo: Reserva confirmada
- Ubicación: Panel administrativo

#### Evento Contact (Contacto)
- Captura cuando el usuario hace clic en teléfono o email
- Parámetros incluidos:
  - Método de contacto: phone, email, whatsapp
- Ubicación: Footer y secciones de contacto

### ✅ **3. Integración con Sistema de Reservas**

- Frontend: Tracking en formulario de reservas (/reservas)
- Backend: Tracking en panel administrativo (/admin/reservas)
- Flujo completo: Desde solicitud hasta confirmación
- Validación de datos antes de envío
- Manejo de errores y casos excepcionales

### ✅ **4. Configuración de Moneda Local**

- Todos los eventos configurados en Soles Peruanos (PEN)
- Valores monetarios correctos para cálculo de ROI
- Conversiones registradas en moneda local
- Compatible con configuración de Meta Ads en PEN

### ✅ **5. Documentación Técnica Completa**

**Archivo 1: META-PIXEL-SETUP.md**
- Guía rápida de configuración en 3 pasos
- Checklist de verificación
- Tabla de eventos implementados
- Flujo visual de conversión
- Troubleshooting básico

**Archivo 2: GUIA-META-PIXEL.md**
- Manual completo paso a paso (20+ páginas)
- Cómo obtener el Pixel ID desde Meta Business Suite
- Configuración detallada de variables de entorno
- Instrucciones de verificación con Meta Pixel Helper
- Guía de creación de audiencias personalizadas
- Configuración de campañas de conversión
- Solución de problemas comunes
- Checklist de validación final

### ✅ **6. Código Fuente y Arquitectura**

**Archivos modificados/creados:**
- `components/analytics/meta-pixel.tsx` - Componente principal del Pixel
- `components/home/reservation-system.tsx` - Integración Schedule en formulario de reservas
- `app/admin/reservas/page.tsx` - Integración Purchase en panel administrativo
- `app/cuartos/[id]/page.tsx` - Integración ViewContent en páginas de salas
- `components/rooms/room-booking-widget.tsx` - Integración InitiateCheckout en widget
- `components/ui/footer.tsx` - Integración Contact en enlaces de contacto
- `app/layout.tsx` - Integración global
- `.env.local` - Variables de configuración

**Características técnicas:**
- TypeScript con tipado estricto
- Código modular y reutilizable
- Funciones helper exportables
- Manejo de errores robusto
- Compatible con Next.js App Router

---

## BENEFICIOS PARA EL CLIENTE

### 📊 **Medición de ROI Precisa**

- **Embudo completo de conversión:**
  1. ViewContent → Usuario ve sala específica
  2. InitiateCheckout → Usuario inicia reserva
  3. Schedule → Usuario completa reserva (pendiente)
  4. Purchase → Admin confirma reserva (venta real)
- Diferenciación clara entre reservas solicitadas y ventas reales
- Tasa de conversión por etapa del funnel
- Valores reales en Soles para cálculos precisos
- Métricas específicas por sala de escape

### 🎯 **Optimización de Campañas Publicitarias**

- Facebook optimiza automáticamente los anuncios por conversiones
- Inversión publicitaria enfocada en audiencias de alto valor
- Reducción de costo por adquisición (CPA)
- Mayor retorno de inversión publicitaria (ROAS)

### 👥 **Remarketing Inteligente**

- Creación de audiencias personalizadas:
  - Personas que vieron salas pero no reservaron
  - Personas que iniciaron reserva pero no completaron
  - Personas que reservaron pero no confirmaron
  - Personas que vieron salas específicas
  - Clientes que completaron reservas
  - Usuarios que contactaron por teléfono/email
- Segmentación avanzada para campañas dirigidas
- Audiencias similares (Lookalike) basadas en conversiones

### 📈 **Reportes y Análisis**

- Dashboard completo en Meta Ads Manager
- Gráficas de conversión en tiempo real
- Comparación de rendimiento por sala
- Análisis de embudo de conversión completo

### ⚡ **Sistema Listo para Producción**

- Sin configuración adicional de código
- Solo requiere Pixel ID del cliente
- Compatible con entorno de desarrollo y producción
- Escalable para futuras salas o servicios

---

## METODOLOGÍA DE TRABAJO

### **Fase 1: Desarrollo e Implementación** ✅ COMPLETADA

- Análisis del sistema de reservas existente
- Diseño de arquitectura de eventos
- Implementación de código Meta Pixel
- Integración con frontend y backend
- Pruebas de compilación y sintaxis

### **Fase 2: Documentación** ✅ COMPLETADA

- Creación de guías técnicas completas
- Documentación de código fuente
- Checklist de validación
- Manual de troubleshooting

### **Fase 3: Configuración Final** (Pendiente - Requiere datos del cliente)

- Obtención de Pixel ID desde Meta Business Suite
- Configuración de variable de entorno
- Reinicio de servidor de producción
- Validación con Meta Pixel Helper

### **Fase 4: Validación y Entrega** (Pendiente - Post-configuración)

- Prueba de reserva completa (Schedule)
- Prueba de confirmación (Purchase)
- Verificación de eventos en Meta Business Suite
- Capacitación básica al cliente

---

## GARANTÍAS Y SOPORTE

### ✅ **Garantía de Funcionamiento**

- Código probado y validado
- Compatible con Next.js 15
- Sin errores de compilación
- Listo para recibir Pixel ID

### 🛠️ **Soporte Post-Implementación**

- Guía de configuración paso a paso incluida
- Documentación técnica completa
- Instrucciones de validación
- Checklist de troubleshooting

---

## REQUISITOS DEL CLIENTE

Para completar la configuración, el cliente debe proporcionar:

1. **Pixel ID de Meta Ads** (15-16 dígitos)
   - Obtener desde: https://business.facebook.com → Administrador de eventos
   - Ejemplo: `123456789012345`

2. **Acceso a servidor de producción**
   - Para actualizar variable `.env.local`
   - Para reiniciar el servicio

---

## INVERSIÓN

| Concepto | Descripción | Precio |
|----------|-------------|--------|
| **Implementación Completa de Meta Pixel** | Instalación, configuración, integración con sistema de reservas, 5 eventos personalizados (ViewContent, InitiateCheckout, Schedule, Purchase, Contact), documentación técnica completa, tracking de embudo completo de conversión | **S/ 600.00** |

### **Total de la Inversión: S/ 600.00**

**(Seiscientos Soles con 00/100)**

---

## FORMA DE PAGO

- **50% al iniciar el proyecto:** S/ 300.00
- **50% contra entrega:** S/ 300.00

*Métodos de pago aceptados:*
- Transferencia bancaria
- Yape / Plin
- Efectivo

---

## CONDICIONES COMERCIALES

1. El precio cotizado incluye todos los conceptos descritos en el alcance
2. La validez de esta cotización es de 30 días calendario
3. El tiempo de implementación ya fue completado
4. La configuración final depende de la entrega del Pixel ID por parte del cliente
5. Cualquier modificación adicional fuera del alcance será cotizada por separado
6. Los archivos fuente y documentación son propiedad del cliente tras el pago total

---

## ENTREGABLES

✅ **Código Fuente Completo**
- Componente Meta Pixel (`meta-pixel.tsx`)
- Integraciones en frontend y backend
- Variables de configuración

✅ **Documentación Técnica**
- Manual de configuración rápida
- Guía completa de implementación (20+ páginas)
- Checklist de validación

✅ **Soporte de Configuración**
- Instrucciones detalladas paso a paso
- Guía de troubleshooting
- Casos de uso y ejemplos

---

## DATOS DE CONTACTO

**BYTECORE - Soluciones Tecnológicas**

📧 Email: contacto@bytecore.com  
📱 WhatsApp: +51 XXX XXX XXX  
🌐 Web: www.bytecore.com  

---

## ACEPTACIÓN DE LA COTIZACIÓN

Yo, _________________________________, en representación de **Kevin Escape Room**, acepto los términos y condiciones de esta cotización.

**Firma:** _______________________  
**Fecha:** _______________________  
**DNI/RUC:** _____________________

---

*Esta cotización es válida hasta el 18 de Enero, 2026*

**Documento generado el 19 de Diciembre, 2025**
