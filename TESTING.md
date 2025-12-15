# Pruebas Unitarias - Kevin Escape Room

Este proyecto incluye pruebas unitarias completas utilizando Jest y React Testing Library.

## 📦 Instalación de Dependencias

```bash
pnpm install
```

## 🧪 Ejecutar Pruebas

### Modo Watch (Desarrollo)
```bash
pnpm test
```

### Ejecución Única (CI/CD)
```bash
pnpm test:ci
```

### Con Cobertura
```bash
pnpm test -- --coverage
```

## 📁 Estructura de Pruebas

```
__tests__/
├── api/
│   ├── ranking/
│   │   ├── obtener.test.ts      # Pruebas para GET /api/ranking/obtener
│   │   └── actualizar.test.ts   # Pruebas para PUT /api/ranking/actualizar/[id]
│   └── equipos/
│       └── eliminar.test.ts     # Pruebas para DELETE /api/equipos/eliminar/[id]
└── lib/
    ├── utils.test.ts            # Pruebas para utilidades de UI (cn)
    ├── utils-backend.test.ts    # Pruebas para validaciones del backend
    └── api-horarios.test.ts     # Pruebas para cliente API de horarios
```

## ✅ Cobertura de Pruebas

### APIs Probadas:
- ✅ **GET /api/ranking/obtener** - Obtener lista de rankings
- ✅ **PUT /api/ranking/actualizar/[id]** - Actualizar ranking
- ✅ **DELETE /api/equipos/eliminar/[id]** - Eliminar equipo con rankings

### Utilidades Probadas:
- ✅ **cn()** - Utilidad para combinar clases CSS con Tailwind
- ✅ **validateRequiredFields()** - Validación de campos requeridos
- ✅ **fetchHorariosDisponibles()** - Cliente API para obtener horarios

## 🎯 Casos de Prueba

### API Rankings
- Obtención exitosa de rankings
- Ordenamiento por puntaje
- Manejo de errores de base de datos
- Retorno de array vacío cuando no hay datos
- Validación de campos requeridos
- Conversión correcta de tipos de datos

### API Equipos
- Eliminación exitosa de equipos
- Eliminación en cascada de rankings asociados
- Manejo de equipos inexistentes
- Manejo de errores de base de datos

### Utilidades
- Combinación de clases CSS
- Manejo de valores condicionales
- Fusión de clases con conflictos
- Validación de campos requeridos
- Validación de valores vacíos, null y undefined

### Cliente API
- Obtención exitosa de datos
- Construcción correcta de URLs
- Manejo de errores HTTP
- Manejo de errores de red

## 🔧 Configuración

### jest.config.js
Configuración principal de Jest con soporte para:
- Next.js
- TypeScript
- Module aliases (@/)
- Coverage collection

### jest.setup.js
Mocks globales para:
- next/navigation
- framer-motion
- @testing-library/jest-dom

## 📊 Ejecutar Pruebas Específicas

### Por archivo
```bash
pnpm test ranking
```

### Por patrón
```bash
pnpm test api/ranking
```

### Un test específico
```bash
pnpm test -t "debe retornar la lista de rankings"
```

## 🐛 Debugging

### Modo Debug
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Ver solo tests fallidos
```bash
pnpm test -- --onlyFailures
```

## 📈 Mejores Prácticas

1. **Aislar dependencias**: Usa mocks para Prisma y APIs externas
2. **Tests descriptivos**: Nombres claros que explican qué se está probando
3. **Arrange-Act-Assert**: Estructura clara en cada test
4. **Limpiar mocks**: Usa `beforeEach` para resetear estado
5. **Cobertura**: Apunta a >80% de cobertura en código crítico

## 🚀 Integración Continua

Las pruebas se ejecutan automáticamente en:
- Pre-commit hooks (opcional)
- Pull requests
- Deploy a producción

## 📝 Agregar Nuevas Pruebas

1. Crear archivo `*.test.ts` o `*.test.tsx` en `__tests__/`
2. Importar dependencias necesarias
3. Mockear dependencias externas
4. Escribir casos de prueba
5. Ejecutar `pnpm test` para verificar

## 🔗 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Next.js](https://nextjs.org/docs/testing)
