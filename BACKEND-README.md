# Backend API - Encrypted Escape Room

Backend completo recreado en Next.js con Prisma ORM, migrando desde CodeIgniter 4 PHP.

## ✅ Completado

### Configuración
- ✅ Prisma ORM configurado con MySQL
- ✅ Schema completo con 6 tablas: `equipo`, `integrante`, `horario`, `ranking`, `reserva`, `sala`, `usuarios_admin`
- ✅ Cliente Prisma singleton en `lib/prisma.ts`
- ✅ Utilidades y helpers en `lib/utils-backend.ts`

### API Endpoints Implementados

#### 🕐 Horarios
- `GET /api/horarios/obtener` - Obtener todos los horarios con información de sala
- `GET /api/horarios/disponibles?sala_id=X&fecha=YYYY-MM-DD` - Horarios disponibles por sala y fecha
- `GET /api/horarios/fechas-ocupadas?sala_id=X` - Fechas con reservas para una sala

#### 📋 Reservas
- `POST /api/reservas/crear` - Crear nueva reserva (ya existía, mantiene compatibilidad)
- `POST /api/reservas/email` - Enviar email de confirmación (ya existía)
- `GET /api/reservas/obtener?sala_id=X&fecha=YYYY-MM-DD` - Obtener reservas con filtros
- `PUT /api/reservas/actualizar/[id]` - Actualizar reserva existente
- `PUT /api/reservas/toggle-activo/[id]` - Activar/desactivar reserva

#### 👥 Equipos
- `POST /api/equipos/crear` - Crear equipo con integrantes y generar código único
- `GET /api/equipos/obtener` - Obtener todos los equipos con integrantes
- `GET /api/equipos/adquirir` - Obtener último equipo creado con su código
- `POST /api/equipos/registrar-resultado` - Registrar resultado del equipo (desencripta código)

#### 🏆 Ranking
- `GET /api/ranking/obtener` - Obtener ranking completo ordenado por puntaje
- `POST /api/ranking/crear` - Crear nuevo registro en ranking
- `PUT /api/ranking/actualizar/[id]` - Actualizar registro de ranking

## 📊 Schema de Base de Datos

```prisma
model Sala {
  id             Int       
  nombre         String    @unique
  descripcion    String
  min_jugadores  Int
  max_jugadores  Int
  duracion       Int
  dificultad     Enum(Baja, Media, Alta, Extrema)
  rating         Decimal
  tags           String?
  imagen         String?
  destacado      Boolean
  reservas_hoy   Int
  created_at     DateTime
  
  horarios       Horario[]
  reservas       Reserva[]
  rankings       Ranking[]
}

model Horario {
  id       Int      
  sala_id  Int
  hora     Time
  
  sala     Sala
  reservas Reserva[]
}

model Equipo {
  id         Int       
  nombre     String    @unique
  codigo     String?   (8-10 chars alfanumérico)
  creado_en  DateTime
  
  integrantes Integrante[]
  rankings    Ranking[]
}

model Integrante {
  id         Int     
  equipo_id  Int
  nombre     String
  
  equipo     Equipo (onDelete: Cascade)
}

model Reserva {
  id                  Int            
  cliente             String
  correo              String
  telefono            String
  sala_id             Int
  horario_id          Int
  fecha               Date
  cantidad_jugadores  Int
  estado              Enum(pendiente, confirmada, cancelada)
  metodo_pago         Enum(yape, plin, transferencia)
  precio_total        Decimal
  created_at          DateTime
  activo              Boolean
  
  sala                Sala (onDelete: Cascade)
  horario             Horario (onDelete: Cascade)
}

model Ranking {
  id                    Int      
  equipo_id             Int
  sala_id               Int
  puntaje               Decimal
  tiempo                Int (minutos)
  cantidad_integrantes  Int?
  registrado_en         DateTime
  
  equipo                Equipo (onDelete: Cascade)
  sala                  Sala (onDelete: Cascade)
}
```

## 🔧 Utilidades Disponibles

### `lib/utils-backend.ts`

- `generateTeamCode(min, max)` - Genera código alfanumérico aleatorio
- `encryptValue(number)` - Encripta valor con prefijo XX y base64
- `decryptValue(string)` - Desencripta valor removiendo prefijo y decodificando
- `parseResultCode(string)` - Parsea código de resultado con formato `"XX..." "XX..." "XX..."`
- `validateRequiredFields(data, fields)` - Valida campos obligatorios

## 📝 Tarifas

```typescript
// Tarifario oficial (implementado en calculateTotalPrice)
2 jugadores → S/ 110 (S/ 55 por persona)
3 jugadores → S/ 150 (S/ 50 por persona)
4 jugadores → S/ 180 (S/ 45 por persona)
5 jugadores → S/ 200 (S/ 40 por persona)
6 jugadores → S/ 240 (S/ 40 por persona)
```

## ⏰ Actualizar Horarios

Para actualizar los horarios a los nuevos (11:00, 12:30, 14:00, 15:30, 17:00, 18:30, 20:00, 21:30):

1. Abrir phpMyAdmin o MySQL Workbench
2. Seleccionar base de datos `scape_room`
3. Ejecutar el script: `prisma/actualizar-horarios.sql`

**Importante**: Este script elimina todos los horarios existentes y crea los nuevos.

## 🔐 Variables de Entorno

```.env
DATABASE_URL="mysql://root:@127.0.0.1:3306/scape_room"
```

## 🚀 Comandos Prisma

```bash
# Generar Prisma Client
npx prisma generate

# Ver base de datos en navegador
npx prisma studio

# Crear migración (si modificas schema)
npx prisma migrate dev --name nombre_migracion

# Actualizar cliente después de cambios en schema
npx prisma generate
```

## 📦 Dependencias Agregadas

- `@prisma/client` - Cliente de Prisma para TypeScript
- `prisma` - CLI de Prisma (dev dependency)
- `dotenv` - Para cargar variables de entorno

## ⚠️ Notas Importantes

1. **Compatibilidad**: Los endpoints mantienen el mismo formato de respuesta que el backend PHP para no romper el frontend existente.

2. **Transacciones**: Operaciones críticas como crear equipo con integrantes usan transacciones de Prisma para garantizar consistencia.

3. **Validaciones**: Todas las rutas incluyen validaciones robustas de datos de entrada.

4. **Códigos únicos**: La generación de códigos de equipo verifica unicidad antes de crear.

5. **Formato de datos**: 
   - Fechas se devuelven en formato ISO
   - Horas en formato HH:MM o HH:MM:SS según el endpoint
   - Decimales se convierten a float en respuestas JSON

## 🔄 Migración del Frontend

El frontend ya usa estos endpoints a través de:
- `lib/api-horarios.ts`
- `lib/api-reservas.ts` 
- `lib/api-ranking.ts`
- `lib/api-equipo.ts`

No requiere cambios ya que mantiene compatibilidad con el formato anterior.

## 🎯 Próximos Pasos

1. Ejecutar script SQL para actualizar horarios
2. Probar todos los endpoints en desarrollo
3. Actualizar nombres de salas en base de datos si es necesario
4. Considerar agregar autenticación con NextAuth.js para endpoints de admin
