# Módulo Generador de Códigos - Documentación

## 📋 Descripción General

El Módulo Generador es una herramienta administrativa que permite al staff del Escape Room generar códigos seguros que contienen la información de los resultados del juego (puntaje, tiempo, integrantes, etc.). Estos códigos luego son entregados a los clientes para que los ingresen en el formulario público.

## 🔐 Seguridad

El sistema utiliza **HMAC SHA-256** para firmar los códigos, lo que garantiza:
- ✅ Los códigos no pueden ser falsificados
- ✅ Los datos no pueden ser modificados por los usuarios
- ✅ Cada código es único y verificable
- ✅ Si alguien intenta cambiar el puntaje, la firma no coincidirá

### Estructura del Código

```
[PAYLOAD_BASE64].[FIRMA_8_CHARS]
```

**Ejemplo:**
```
RVZQLThGMktaM3wxfDEwMDB8NTB8M3wyNzExMjU.7a3f9e2b
```

**Payload decodificado:**
```
EQP-8F2KZ3|1|1000|50|3|271125
[Código Equipo]|[Sala]|[Puntaje]|[Tiempo]|[Integrantes]|[Fecha]
```

## 🎯 Flujo de Uso

### 1. En el Panel Admin (Staff)

1. **Acceder al módulo**: `/admin/generador`
2. **Buscar el equipo** que acaba de jugar (por nombre o código)
3. **Seleccionar la sala** que jugaron
4. **Ingresar datos**:
   - Puntaje obtenido
   - Tiempo tomado (en minutos)
   - Cantidad de integrantes que jugaron
   - Fecha (se rellena automáticamente)
5. **Hacer clic en "Generar Código"**
6. **Copiar o imprimir el código** para entregarlo al cliente

### 2. Cliente Final

1. El cliente recibe el código (impreso o en pantalla)
2. Va a la página pública del sitio web
3. Encuentra la sección "Registrar Resultados"
4. Ingresa:
   - Su código de equipo (ej: `EQP-8F2KZ3`)
   - El código de resultado que recibió del staff
5. Envía el formulario
6. El sistema valida la firma y registra los datos en el ranking

## 🛠️ Instalación y Configuración

### Variables de Entorno

Agrega a tu archivo `.env`:

```bash
CODE_SECRET_KEY=tu_clave_super_secreta_aqui_cambiar_en_produccion
```

⚠️ **IMPORTANTE**: Cambia esta clave en producción y guárdala de forma segura. Si pierdes esta clave, no podrás validar códigos antiguos.

### Endpoints API Creados

1. **POST** `/api/generador/crear-codigo`
   - Genera un nuevo código firmado
   - Parámetros: equipoId, equipoCodigo, salaId, puntaje, tiempo, integrantes, fecha

2. **POST** `/api/generador/validar-codigo`
   - Valida un código y extrae los datos
   - Parámetros: codigo

3. **POST** `/api/equipos/registrar-resultado` (actualizado)
   - Valida el código y registra el resultado
   - Parámetros: codigo_equipo, codigo_resultado

## 📱 Características del Módulo

### Búsqueda Inteligente
- Busca equipos por nombre o código
- Resultados en tiempo real
- Auto-completa el número de integrantes si está disponible

### Validaciones
- Todos los campos obligatorios están marcados
- Validación de números positivos
- Fecha automática (puede modificarse)
- Previene generación sin equipo seleccionado

### Vista de Resultado
- Muestra el código generado en grande
- Botón para copiar al portapapeles
- Opción de imprimir
- Resumen de todos los datos
- Instrucciones claras para el cliente

## 🎨 Diseño

El módulo sigue el mismo diseño claro y profesional del resto del panel admin:
- Fondos blancos
- Textos en grises oscuros para máximo contraste
- Acentos en color dorado (brand-gold)
- Diseño responsivo
- Iconos lucide-react

## 🔍 Validación de Códigos

### En el Backend

El endpoint `/api/equipos/registrar-resultado` hace:

1. **Separar** payload y firma del código
2. **Decodificar** el payload desde Base64
3. **Calcular** la firma esperada con la misma clave secreta
4. **Comparar** firmas (si no coinciden → código inválido)
5. **Extraer** datos del payload
6. **Verificar** que el código de equipo coincida
7. **Registrar** en la base de datos

### Mensajes de Error

- ❌ "Formato de código inválido" → Estructura incorrecta
- ❌ "Código corrupto o inválido" → No se puede decodificar
- ❌ "Código manipulado" → Firma no coincide (intento de hackeo)
- ❌ "El código de equipo no coincide" → Código y equipo no corresponden
- ❌ "Equipo no encontrado" → No existe en la BD
- ❌ "Este equipo ya tiene un resultado" → Ya registró para esa sala

## 💡 Mejoras Futuras Sugeridas

1. **QR Code**: Generar un QR con el código para escanear
2. **Impresión térmica**: Integración con impresora de tickets
3. **Historial**: Ver todos los códigos generados
4. **Expiración**: Códigos válidos solo por X horas
5. **Múltiples intentos**: Limitar intentos de validación
6. **Notificaciones**: Email al equipo cuando registren su resultado
7. **Analytics**: Dashboard de uso del módulo

## 📞 Soporte

Para cualquier problema o duda sobre el módulo:
- Revisar los logs del servidor
- Verificar que la clave secreta sea la misma en generación y validación
- Asegurar que los códigos se copien completos (sin espacios extra)

---

**Versión**: 1.0  
**Última actualización**: Noviembre 2025
