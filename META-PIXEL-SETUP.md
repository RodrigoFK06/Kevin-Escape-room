# 🚀 Meta Pixel - Setup Rápido

## ✅ Estado de Implementación

**TODO ESTÁ IMPLEMENTADO Y LISTO** ✨

Solo necesitas configurar tu Pixel ID del cliente.

---

## 📋 Configuración en 3 Pasos

### 1. Obtén el Pixel ID

Ve a https://business.facebook.com → **Administrador de eventos** → Copia el Pixel ID (15-16 dígitos)

### 2. Configura el .env.local

```bash
# Reemplaza TU_PIXEL_ID_AQUI con el ID real
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
```

### 3. Reinicia el servidor

```bash
# Detén el servidor (Ctrl+C) y reinicia
pnpm dev
```

---

## 🎯 Eventos Implementados

### ✅ Automáticos (Ya funcionan)

| Evento | Cuándo se dispara | Moneda | Ubicación |
|--------|------------------|--------|-----------|
| `PageView` | En cada página | - | Automático en layout |
| `Schedule` | Cliente hace reserva | **PEN** | `/reservas` |
| `Purchase` | Admin confirma reserva | **PEN** | `/admin/reservas` |

### 📊 Flujo de Conversión

```
Cliente reserva → Schedule (S/ 110, PEN)
        ↓
Admin confirma → Purchase (S/ 110, PEN)
```

---

## 🔍 Verificar Funcionamiento

### Opción 1: Meta Pixel Helper (Chrome)
1. Instala la extensión "Meta Pixel Helper"
2. Abre tu sitio
3. Verás el Pixel activo ✅

### Opción 2: Administrador de Eventos
1. Ve a Meta Business Suite
2. Administrador de eventos → Tu Pixel
3. "Probar eventos" → Ingresa tu URL
4. Haz una reserva de prueba
5. Verás el evento `Schedule` aparecer
6. Confírmala en admin
7. Verás el evento `Purchase` aparecer

---

## 📈 Métricas que Verás

- **Schedule**: Total de reservas solicitadas
- **Purchase**: Total de ventas confirmadas  
- **Conversion Rate**: % de reservas que se convierten en ventas
- **Revenue**: Ingresos en PEN (Soles)

---

## 🎯 Beneficios

✅ **ROI Preciso**: Mide reservas vs ventas reales  
✅ **Moneda Correcta**: Todo en PEN (Soles peruanos)  
✅ **Automático**: No requiere código adicional  
✅ **Optimización**: Facebook optimiza por conversiones reales  

---

## 📝 Archivos Modificados

| Archivo | Qué hace |
|---------|----------|
| `components/analytics/meta-pixel.tsx` | Eventos Schedule y Purchase |
| `components/home/reservation-system.tsx` | Dispara Schedule al reservar |
| `app/admin/reservas/page.tsx` | Dispara Purchase al confirmar |
| `.env.local` | Configuración del Pixel ID |

---

## 🆘 Troubleshooting

**No veo el Pixel**: Reinicia el servidor y limpia caché del navegador  
**Eventos no aparecen**: Espera 5-10 minutos, no son instantáneos  
**Valores en USD**: Verifica que tu cuenta de Meta Ads esté en PEN  

---

**Ver guía completa:** [`GUIA-META-PIXEL.md`](GUIA-META-PIXEL.md)
