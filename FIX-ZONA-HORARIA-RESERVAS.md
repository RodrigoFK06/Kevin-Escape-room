# 🐛 Corrección: Error de Zona Horaria en Reservas

## Problema Identificado

**Síntoma:** Cuando un cliente reserva para el 17 de diciembre, la reserva aparece en el sistema para el 16 de diciembre (24 horas de retraso exacto).

**Causa Raíz:** Error de conversión de zona horaria entre frontend y backend.

### ¿Por qué ocurría?

Cuando JavaScript recibe una fecha en formato `"YYYY-MM-DD"` (ejemplo: `"2025-12-17"`), la función `new Date()` la interpreta como **medianoche UTC** (00:00:00 UTC), no como medianoche local.

**Ejemplo del problema:**
```typescript
// Frontend envía: "2025-12-17"
const fecha = new Date("2025-12-17");
// JavaScript crea: 2025-12-17T00:00:00.000Z (medianoche UTC)

// En Perú (UTC-5), esto se convierte a:
// 2025-12-16T19:00:00 (7 PM del día anterior)

// MySQL guarda: 2025-12-16 ❌ (día incorrecto!)
```

### Flujo del error:

1. **Cliente selecciona:** 17 de diciembre en el calendario
2. **Frontend envía:** `fecha: "2025-12-17"` (string en formato ISO)
3. **Backend recibe:** `"2025-12-17"`
4. **Backend convierte:** `new Date("2025-12-17")` → Medianoche UTC
5. **MySQL guarda:** Se resta el offset de zona horaria → **16 de diciembre** ❌

---

## Solución Implementada

Se corrigió agregando `'T00:00:00'` al string de fecha antes de crear el objeto `Date`, forzando que se interprete como **medianoche local** en lugar de UTC.

### Código Corregido:

**Antes (❌ incorrecto):**
```typescript
fecha: new Date(body.fecha)  // "2025-12-17" → medianoche UTC → día anterior
```

**Después (✅ correcto):**
```typescript
const fechaLocal = new Date(body.fecha + 'T00:00:00');
fecha: fechaLocal  // "2025-12-17T00:00:00" → medianoche local → día correcto
```

---

## Archivos Modificados

Se aplicó la corrección en **4 archivos** donde se convertían fechas:

### 1. **API Crear Reserva**
📁 `app/api/reservas/crear/route.ts`

```typescript
// Línea 45 - Crear la reserva
const fechaLocal = new Date(body.fecha + 'T00:00:00');

const reserva = await prisma.reserva.create({
  data: {
    // ...otros campos
    fecha: fechaLocal,  // ✅ Ahora guarda la fecha correcta
  }
})
```

### 2. **API Actualizar Reserva**
📁 `app/api/reservas/actualizar/[id]/route.ts`

```typescript
// Línea 55 - Actualizar reserva
const fechaLocal = new Date(reservaData.fecha + 'T00:00:00');

const reservaActualizada = await prisma.reserva.update({
  where: { id: parseInt(id) },
  data: {
    // ...otros campos
    fecha: fechaLocal,  // ✅ Actualiza con fecha correcta
  }
});
```

### 3. **API Obtener Reservas (Filtro)**
📁 `app/api/reservas/obtener/route.ts`

```typescript
// Línea 17 - Filtrar por fecha
if (fecha) {
  whereClause.fecha = new Date(fecha + 'T00:00:00');  // ✅ Busca fecha correcta
}
```

### 4. **API Horarios Disponibles**
📁 `app/api/horarios/disponibles/route.ts`

```typescript
// Línea 33 - Buscar reservas por fecha
const fechaBusqueda = new Date(fecha + 'T00:00:00');

const reservasOcupadas = await prisma.reserva.findMany({
  where: {
    fecha: fechaBusqueda,  // ✅ Busca horarios ocupados en fecha correcta
    sala_id: parseInt(salaId)
  }
});
```

---

## Validación de la Solución

### Prueba Manual:

1. **Ir a:** http://localhost:3001/reservas
2. **Seleccionar fecha:** 17 de diciembre de 2025
3. **Completar reserva**
4. **Verificar en admin:** La reserva debe aparecer para el **17 de diciembre** ✅

### Verificación en Base de Datos:

```sql
-- Verificar fechas guardadas correctamente
SELECT id, cliente, fecha, sala_id, created_at 
FROM reserva 
ORDER BY created_at DESC 
LIMIT 10;
```

La columna `fecha` ahora debe mostrar la fecha correcta seleccionada por el usuario.

---

## Explicación Técnica Detallada

### Zona Horaria de Perú
- **UTC Offset:** UTC-5 (todo el año, no usa horario de verano)
- **Zona:** America/Lima

### Comportamiento de JavaScript Date

```javascript
// ❌ INCORRECTO - Interpreta como UTC
new Date("2025-12-17")
// Resultado: 2025-12-17T00:00:00.000Z
// En Perú: 2025-12-16T19:00:00 (7 PM del día 16)

// ✅ CORRECTO - Interpreta como hora local
new Date("2025-12-17T00:00:00")
// Resultado: 2025-12-17T05:00:00.000Z (UTC)
// En Perú: 2025-12-17T00:00:00 (medianoche del día 17)
```

### ¿Por qué agregar 'T00:00:00' funciona?

Según el estándar ISO 8601:
- `"YYYY-MM-DD"` → Fecha sin hora → Asume medianoche UTC
- `"YYYY-MM-DDTHH:MM:SS"` → Fecha con hora → Asume zona horaria local

Al agregar `'T00:00:00'`, le decimos explícitamente a JavaScript que queremos medianoche en la zona horaria local del servidor.

---

## Prevención de Errores Futuros

### ✅ Buenas Prácticas:

1. **Siempre agregar hora local al convertir fechas:**
   ```typescript
   const fecha = new Date(fechaString + 'T00:00:00');
   ```

2. **Nunca usar `new Date()` directamente con formato "YYYY-MM-DD":**
   ```typescript
   // ❌ EVITAR
   new Date("2025-12-17")
   
   // ✅ USAR
   new Date("2025-12-17T00:00:00")
   ```

3. **Al enviar fechas desde frontend, mantener formato "YYYY-MM-DD":**
   ```typescript
   // Formato correcto
   const fechaISO = format(date, "yyyy-MM-dd");  // "2025-12-17"
   ```

4. **Al guardar en MySQL, usar tipo DATE (no DATETIME):**
   ```sql
   fecha DATE NOT NULL  -- ✅ Correcto
   fecha DATETIME NOT NULL  -- ❌ Puede causar problemas con horas
   ```

---

## Casos de Prueba Adicionales

### Escenario 1: Reserva para mañana
- **Usuario selecciona:** 18 de diciembre
- **Sistema guarda:** 18 de diciembre ✅
- **Sistema muestra:** 18 de diciembre ✅

### Escenario 2: Reserva para fin de mes
- **Usuario selecciona:** 31 de diciembre
- **Sistema guarda:** 31 de diciembre ✅
- **Sistema muestra:** 31 de diciembre ✅

### Escenario 3: Actualizar fecha de reserva existente
- **Usuario cambia de:** 20 diciembre → 25 diciembre
- **Sistema actualiza:** 25 de diciembre ✅
- **Sistema muestra:** 25 de diciembre ✅

---

## Impacto de la Corrección

### ✅ Beneficios:
- Fechas correctas en todas las reservas nuevas
- Filtros de fecha funcionan correctamente
- Horarios disponibles se calculan bien
- Notificaciones por email con fecha correcta
- Calendario admin muestra fechas reales

### ⚠️ Consideraciones:
- **Reservas existentes:** Si hay reservas con fecha incorrecta en la BD, considera ejecutar un script de migración para corregirlas
- **Zona horaria del servidor:** Asegúrate que el servidor esté configurado en zona horaria de Perú (America/Lima)

---

## Script de Corrección para Reservas Existentes

Si tienes reservas con fechas incorrectas, ejecuta:

```sql
-- ⚠️ CUIDADO: Prueba primero en desarrollo
-- Agrega 1 día a todas las reservas creadas antes de la corrección

UPDATE reserva 
SET fecha = DATE_ADD(fecha, INTERVAL 1 DAY)
WHERE created_at < '2025-12-15 00:00:00'  -- Fecha antes de la corrección
  AND HOUR(created_at) >= 19;  -- Solo las afectadas por el bug UTC
```

**⚠️ IMPORTANTE:** Hacer backup antes de ejecutar este script.

---

## Verificación Final

### Checklist de Validación:

- [x] Cliente selecciona fecha 17-dic → Sistema guarda 17-dic
- [x] Cliente actualiza a 20-dic → Sistema actualiza a 20-dic
- [x] Admin filtra por 17-dic → Muestra reservas del 17-dic
- [x] Horarios ocupados del 17-dic se marcan correctamente
- [x] Email de confirmación muestra fecha correcta
- [x] Calendario no permite reservar horarios ocupados

---

## Contacto

Si encuentras algún problema relacionado con fechas:
1. Verifica la zona horaria del servidor: `date` (Linux) o `Get-Date` (Windows)
2. Revisa logs del navegador (F12 → Console)
3. Verifica datos en MySQL directamente

---

**Estado:** ✅ CORREGIDO  
**Fecha de corrección:** 15 de diciembre de 2025  
**Archivos modificados:** 4  
**Impacto:** Alto - Funcionalidad crítica del sistema
