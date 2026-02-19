# Sprint 1 — Actividad 3: Integración Paralela de APIs Externas

> **Sprint Goal:** Enriquecer las sesiones de trabajo con datos contextuales (clima y festivos) obtenidos en paralelo, demostrando coordinación multi-agente, debugging guiado y visual feedback profesional.

---

## 1. Roles Scrum

| Rol | Responsable | Responsabilidad |
|-----|------------|-----------------|
| **Scrum Master** | Agente coordinador (Antigravity) | Facilitar, eliminar impedimentos, asegurar Scrum |
| **Product Owner** | Profesor / Evaluador | Define criterios de aceptación |
| **Developer 1** | Agente 1 — API Clima | `weather-service.ts`, `/api/weather/route.ts` |
| **Developer 2** | Agente 2 — API Festivos | `holiday-service.ts`, `/api/holidays/route.ts` |
| **Developer 3** | Agente 3 — Debugging | Validación, testing, simulación de fallos |

---

## 2. División de Tareas Paralelas

### Agente 1 — Integración API Clima (OpenWeatherMap)
- Crear `src/app/api/weather/route.ts` (proxy server-side)
- Crear `src/services/weather-service.ts` (cliente)
- Manejo de timeout (5s), errores HTTP, y respuestas parciales
- API Key segura en `process.env.OPENWEATHERMAP_API_KEY`

### Agente 2 — Integración API Festivos (Nager.Date)
- Crear `src/app/api/holidays/route.ts` (proxy server-side)
- Crear `src/services/holiday-service.ts` (cliente)
- Consulta por `countryCode` y fecha actual
- API pública (sin key requerida)

### Agente 3 — Debugging y Validación
- Crear `src/services/context-enrichment-service.ts` (orquestador con `Promise.allSettled`)
- Modificar `session-store.ts` para integrar el enrichment
- Crear `session-context-badge.tsx` (visual feedback)
- Ejecutar y documentar debugging guiado

### Estrategia Anti-Conflictos
| Estrategia | Implementación |
|-----------|---------------|
| **Separación de archivos** | Cada agente trabaja en archivos distintos |
| **Interfaces compartidas** | Tipos definidos antes de iniciar (`WeatherResult`, `HolidayResult`) |
| **Punto de integración único** | `context-enrichment-service.ts` es el único punto de merge |
| **Orden de integración** | DB → Types → Services → Store → UI (dependencias claras) |

---

## 3. Arquitectura de Integración

```
┌──────────────────────────────────────────────┐
│  CLIENTE (Browser)                           │
│                                              │
│  time-tracker.tsx                            │
│       │                                      │
│  session-store.ts                            │
│       │                                      │
│  context-enrichment-service.ts               │
│       │                                      │
│  ┌────▼─────────────────────────────┐        │
│  │ Promise.allSettled([             │        │
│  │   WeatherService.getWeather(),   │        │
│  │   HolidayService.checkHoliday()  │        │
│  │ ])                               │        │
│  └────┬──────────────┬──────────────┘        │
│       │              │                       │
│  /api/weather    /api/holidays               │
└───────┼──────────────┼───────────────────────┘
        │              │
  ┌─────▼─────┐  ┌─────▼──────────┐
  │OpenWeather │  │ Nager.Date API │
  │   Map API  │  │ (sin API key)  │
  └────────────┘  └────────────────┘
```

---

## 4. Uso de Promise.allSettled (Código Real)

```typescript
// context-enrichment-service.ts — Líneas clave
const [weatherResult, holidayResult] = await Promise.allSettled([
    WeatherService.getWeather(lat, lng),
    HolidayService.checkHoliday(countryCode),
]);

// Si weather falla → holiday aún se procesa
// Si holiday falla → weather aún se procesa
// La sesión se crea SIEMPRE
```

**¿Por qué `allSettled` y no `all`?**
- `Promise.all` rechaza todo si UNA promesa falla
- `Promise.allSettled` espera a TODAS y reporta cada resultado individualmente
- Esto permite **datos parciales** en lugar de **falla total**

---

## 5. Debugging Guiado — Simulación Documentada

### Escenario: API Key de OpenWeatherMap no configurada

#### 5.1 Simular el Error
```
# .env.local sin OPENWEATHERMAP_API_KEY configurada
OPENWEATHERMAP_API_KEY=invalid_key
```

#### 5.2 Detectar el Error
Al iniciar sesión, la consola muestra:
```
[Weather API] OpenWeatherMap error: 401 {"cod":401,"message":"Invalid API key..."}
[WeatherService] API error: 502 {...}
[Enrichment] Completed with partial errors: ["Weather data unavailable (no coordinates or API error)"]
```

#### 5.3 Causa Raíz
- **Problema**: La API de OpenWeatherMap retorna HTTP 401 (Unauthorized)
- **Causa**: API key inválida o no configurada en variables de entorno
- **Impacto**: Solo afecta datos de clima; festivos funcionan correctamente

#### 5.4 Corrección
1. Obtener API key gratuita en [openweathermap.org](https://openweathermap.org/api)
2. Configurar en `.env.local`:
   ```
   OPENWEATHERMAP_API_KEY=tu_api_key_real
   ```
3. Reiniciar el servidor de desarrollo

#### 5.5 Validación
- Badge muestra clima + festivo correctamente
- Consultar DB: `weather_condition` y `temperature` ya no son NULL
- Sin errores en consola

### Escenario 2: Sin Geolocalización

#### Simular
- Denegar permisos de ubicación en el navegador

#### Resultado Esperado
- `[Session] Geolocation unavailable`
- Clima queda NULL, festivos sí se consultan
- Badge muestra "Datos parciales" con tooltip detallado
- La sesión se crea normalmente

---

## 6. Visual Feedback Implementado

| Estado | Visual | Componente |
|--------|--------|------------|
| **Cargando** | 🔄 Spinner azul + "Consultando clima y festivos..." | `session-context-badge.tsx` |
| **Éxito completo** | ☀️ Clear 22°C + (badge feriado si aplica) | `session-context-badge.tsx` |
| **Error parcial** | ⚠️ "Datos parciales" + tooltip con detalles | `session-context-badge.tsx` |
| **Error total** | ⚠️ "Contexto no disponible" rojo | `session-context-badge.tsx` |
| **Feriado** | 🎉 Badge ámbar con nombre del feriado | `session-context-badge.tsx` |

---

## 7. Manejo Seguro de API Keys

| Variable | Ubicación | Exposición |
|----------|-----------|------------|
| `OPENWEATHERMAP_API_KEY` | `.env.local` (sin prefijo `NEXT_PUBLIC_`) | Solo servidor |
| Nager.Date | No requiere key | Pública |
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` | Público (diseñado así) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` | Público (diseñado así) |

**Flujo seguro**: Cliente → `/api/weather` (Next.js Route Handler) → OpenWeatherMap

---

## 8. Simulación de Daily Scrum

### Daily 1 (Inicio del Sprint)
> **SM**: ¿Qué vas a hacer hoy?
> **Dev 1**: Crear el proxy de clima y el servicio cliente.
> **Dev 2**: Crear el proxy de festivos y el servicio cliente.
> **Dev 3**: Preparar el orquestador y los tipos compartidos.
> **SM**: ¿Impedimentos?
> **Dev 1**: Necesito la API key de OpenWeatherMap.
> **SM**: Procedemos con key de prueba, la real la configura cada desarrollador.

### Daily 2 (Integración)
> **SM**: ¿Qué completaste?
> **Dev 1**: Proxy y servicio de clima listos. Testeado con coordenadas de Lima.
> **Dev 2**: Proxy y servicio de festivos listos. Consulta correcta para Perú.
> **Dev 3**: Orquestador listo, integré con el session-store.
> **SM**: ¿Impedimentos?
> **Dev 3**: El badge no muestra nada si ambas APIs fallan. Agregué estado "error".

### Daily 3 (Validación)
> **SM**: Sprint review mañana. ¿Estado final?
> **Dev 1**: Todo verde. Debugging documentado.
> **Dev 2**: Festivos verificados para PE y CO.
> **Dev 3**: Visual feedback completo. Build sin errores.

---

## 9. Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| API key expirada | Media | Bajo | Fallback gracioso, sesión siempre se crea |
| Rate limit OpenWeatherMap | Baja | Bajo | Cache de 5 min en geolocalización |
| Nager.Date caída | Baja | Bajo | `Promise.allSettled` aísla el fallo |
| Geolocalización denegada | Alta | Bajo | Clima queda null, festivos funcionan |
| Conflictos entre agentes | Media | Alto | Archivos separados, interfaces compartidas |

---

## 10. Checklist de Validación Final

- [x] Migración SQL creada (`004_weather_holiday_columns.sql`)
- [x] Types actualizados (`database.ts`, `models.ts`)
- [x] API Routes creadas (`/api/weather`, `/api/holidays`)
- [x] Services modulares (`weather-service.ts`, `holiday-service.ts`, `context-enrichment-service.ts`)
- [x] `Promise.allSettled` implementado en `context-enrichment-service.ts`
- [x] `session-store.ts` integra enrichment sin romper flujo existente
- [x] `session-service.ts` acepta enrichment data opcional
- [x] Visual feedback: loading, success, partial-error, error
- [x] Badge de feriado animado
- [x] API keys seguras (server-side only)
- [x] RLS no modificado
- [x] Código existente no eliminado
- [ ] `npm run build` sin errores
- [ ] Migración ejecutada en Supabase
- [ ] Test manual: iniciar sesión con/sin API key

---

## 11. Archivos Creados / Modificados

### Nuevos
| Archivo | Propósito |
|---------|-----------|
| `supabase/migrations/004_weather_holiday_columns.sql` | Migración DB |
| `src/app/api/weather/route.ts` | Proxy clima (server) |
| `src/app/api/holidays/route.ts` | Proxy festivos (server) |
| `src/services/weather-service.ts` | Cliente clima |
| `src/services/holiday-service.ts` | Cliente festivos |
| `src/services/context-enrichment-service.ts` | Orquestador paralelo |
| `src/components/dashboard/session-context-badge.tsx` | Visual feedback |

### Modificados
| Archivo | Cambio |
|---------|--------|
| `src/types/database.ts` | 4 campos nuevos en work_sessions |
| `src/types/models.ts` | 4 campos opcionales en WorkSession |
| `src/services/session-service.ts` | `startSession` acepta enrichment |
| `src/stores/session-store.ts` | Flujo de enrichment + estado |
| `src/components/dashboard/time-tracker.tsx` | Render SessionContextBadge |
| `supabase/schema_reference.sql` | Documentación actualizada |
| `.env.local` | `OPENWEATHERMAP_API_KEY` |

---

## 12. Guión Resumido para Video Grupal

### Estructura (5-7 minutos)

**[00:00 - 01:00] Introducción**
- Sprint Goal
- Roles del equipo
- Contexto: app ya funcional, extendemos work_sessions

**[01:00 - 02:30] Demostración de Tareas Paralelas**
- Mostrar los 3 servicios creados en paralelo
- Explicar `Promise.allSettled` vs `Promise.all`
- Diagrama de arquitectura

**[02:30 - 04:00] Integración y Visual Feedback**
- Demo en vivo: iniciar sesión → badge de carga → datos de clima
- Mostrar badge de feriado (si aplica o simulado)
- Mostrar manejo de error parcial

**[04:00 - 05:30] Debugging Guiado**
- Simular API key inválida → ver error en consola
- Explicar causa raíz
- Corregir → verificar solución
- Mostrar que la sesión se creó aún con el error

**[05:30 - 06:30] Scrum y Coordinación**
- Resumen de Daily Scrums
- Estrategia anti-conflictos
- Riesgos identificados y mitigados

**[06:30 - 07:00] Cierre**
- Resumen de entregables
- Checklist de validación cumplido
- Conclusiones del equipo
