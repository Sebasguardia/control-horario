# 📋 Proyecto Final: TimeTrack Pro — Sistema de Control Horario

**Materia:** Ingeniería de Software  
**Fecha de entrega:** Febrero 2026  
**Equipo:** 4 integrantes  

---

## 📌 Tabla de Contenidos

1. [Información del Equipo y Roles](#1-información-del-equipo-y-roles)
2. [Descripción del Proyecto](#2-descripción-del-proyecto)
3. [Metodología Scrum](#3-metodología-scrum)
4. [Product Backlog](#4-product-backlog)
5. [Sprint Planning](#5-sprint-planning)
6. [Actividades por Rol](#6-actividades-por-rol)
7. [Evidencias de Desarrollo](#7-evidencias-de-desarrollo)
8. [Preguntas y Respuestas del Proyecto](#8-preguntas-y-respuestas-del-proyecto)
9. [Guion del Video de Presentación](#9-guion-del-video-de-presentación)
10. [Conclusiones](#10-conclusiones)

---

## 1. Información del Equipo y Roles

### 🏢 Equipo Scrum

| Rol | Responsabilidad Principal |
|-----|--------------------------|
| **Scrum Master** | Facilita las ceremonias Scrum, elimina impedimentos, asegura que el equipo sigue la metodología ágil |
| **Product Owner** | Define la visión del producto, prioriza el backlog, representa la voz del cliente/usuario |
| **Developer 1** | Desarrollo frontend (UI/UX, componentes React, diseño responsive) |
| **Developer 2** | Desarrollo backend (Supabase, base de datos, autenticación, APIs) |

### 📊 Distribución de Responsabilidades

```
Scrum Master ──────► Facilitación, impedimentos, ceremonias, métricas
Product Owner ─────► Backlog, priorización, criterios de aceptación, validación
Developer 1 ───────► Frontend: Next.js, React, Tailwind CSS, componentes UI
Developer 2 ───────► Backend: Supabase, PostgreSQL, Auth, services, APIs
```

---

## 2. Descripción del Proyecto

### 2.1 ¿Qué es TimeTrack Pro?

**TimeTrack Pro** es una aplicación web moderna de control y gestión de horarios laborales. Permite a los usuarios registrar sus jornadas de trabajo, gestionar pausas, calcular horas trabajadas automáticamente y generar reportes visuales.

### 2.2 Problema que Resuelve

Muchos trabajadores, freelancers y equipos pequeños carecen de una herramienta sencilla y elegante para:
- Registrar sus horas de entrada y salida
- Controlar los tiempos de pausa
- Visualizar cuántas horas realmente trabajan
- Generar reportes para facturación o rendición de cuentas

### 2.3 Solución Propuesta

Una **Progressive Web App (PWA)** que ofrece:
- ⏱️ Timer en tiempo real para registrar jornadas
- ☕ Gestión de pausas por tipo (almuerzo, descanso, personal)
- 📊 Dashboard interactivo con estadísticas
- 📅 Calendario de asistencia visual
- 📈 Reportes exportables a PDF y CSV
- 🌙 Modo oscuro / claro
- 📱 100% responsive (móvil, tablet, desktop)
- 🔒 Autenticación segura con Supabase

### 2.4 Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| Framework | Next.js 14+ (App Router) |
| Lenguaje | TypeScript 5+ |
| Estilos | Tailwind CSS 3.4.19 |
| Backend | Supabase (PostgreSQL + Auth) |
| Charts | Recharts |
| Animaciones | Framer Motion |
| Estado | Zustand + React Query |
| Forms | React Hook Form + Zod |
| Deploy | Vercel + Supabase Cloud |

---

## 3. Metodología Scrum

### 3.1 ¿Por qué Scrum?

Elegimos Scrum porque:
- Permite adaptarnos a cambios rápidamente
- Entregas incrementales cada sprint
- Roles bien definidos
- Ceremonias que aseguran comunicación constante
- Ideal para equipos pequeños (4 personas)

### 3.2 Ceremonias Scrum Implementadas

| Ceremonia | Frecuencia | Duración | Descripción |
|-----------|-----------|----------|-------------|
| **Sprint Planning** | Inicio de sprint | 1 hora | Planificar las historias de usuario del sprint |
| **Daily Standup** | Diaria | 15 min | ¿Qué hice ayer? ¿Qué haré hoy? ¿Hay impedimentos? |
| **Sprint Review** | Fin de sprint | 30 min | Demo de lo desarrollado a los stakeholders |
| **Sprint Retrospective** | Fin de sprint | 30 min | ¿Qué salió bien? ¿Qué mejorar? ¿Acciones? |

### 3.3 Definición de Sprints

Se planificaron **6 sprints de 2 semanas** cada uno (12 semanas total):

| Sprint | Semanas | Enfoque Principal |
|--------|---------|-------------------|
| Sprint 1 | 1–2 | Configuración del proyecto, autenticación, estructura base |
| Sprint 2 | 3–4 | Funcionalidad core: registro de jornadas, pausas, timer |
| Sprint 3 | 5–6 | Historial, calendario, gráficos y estadísticas |
| Sprint 4 | 7–8 | Reportes, proyectos, notificaciones, modo offline |
| Sprint 5 | 9–10 | Testing (unitarios, integración, E2E), corrección de bugs |
| Sprint 6 | 11–12 | Deploy a producción, documentación, monitoreo |

### 3.4 Artefactos Scrum

- **Product Backlog:** Lista completa priorizada de todas las funcionalidades
- **Sprint Backlog:** Subconjunto del backlog para cada sprint
- **Incremento:** Producto funcional entregable al final de cada sprint
- **Definition of Done (DoD):**
  - Código revisado por al menos 1 compañero (code review)
  - Sin errores de TypeScript (`tsc --noEmit` pasa)
  - Sin warnings de ESLint
  - Tests unitarios escritos y pasando
  - Diseño responsive verificado
  - Documentación actualizada

---

## 4. Product Backlog

### 4.1 Historias de Usuario Priorizadas

#### 🔴 Prioridad Alta (Must Have)

| ID | Historia de Usuario | Puntos |
|----|---------------------|--------|
| HU-01 | Como usuario, quiero registrarme e iniciar sesión para acceder a mis datos de forma segura | 8 |
| HU-02 | Como usuario, quiero iniciar mi jornada laboral con un clic para registrar mi hora de entrada | 5 |
| HU-03 | Como usuario, quiero finalizar mi jornada para registrar mi hora de salida y ver el resumen | 5 |
| HU-04 | Como usuario, quiero tomar pausas (almuerzo, descanso, personal) para que el tiempo se calcule correctamente | 8 |
| HU-05 | Como usuario, quiero ver un timer en vivo durante mi jornada para saber cuánto tiempo llevo trabajando | 5 |
| HU-06 | Como usuario, quiero ver un dashboard con mis estadísticas para tener una visión general de mi trabajo | 13 |

#### 🟡 Prioridad Media (Should Have)

| ID | Historia de Usuario | Puntos |
|----|---------------------|--------|
| HU-07 | Como usuario, quiero ver mi historial de jornadas para revisar mis registros pasados | 8 |
| HU-08 | Como usuario, quiero un calendario de asistencia con colores para visualizar mis días trabajados | 8 |
| HU-09 | Como usuario, quiero generar reportes PDF/CSV para compartir mis horas con mi empleador | 13 |
| HU-10 | Como usuario, quiero ver gráficos de productividad para identificar patrones en mi trabajo | 8 |
| HU-11 | Como usuario, quiero configurar mi perfil (horario esperado, zona horaria, tema) | 5 |
| HU-12 | Como usuario, quiero que la app funcione offline para no perder registros sin internet | 8 |

#### 🟢 Prioridad Baja (Could Have)

| ID | Historia de Usuario | Puntos |
|----|---------------------|--------|
| HU-13 | Como usuario, quiero asociar jornadas a proyectos para tracking por cliente/tarea | 5 |
| HU-14 | Como usuario, quiero recibir notificaciones/recordatorios para no olvidar registrar entrada/salida | 5 |
| HU-15 | Como usuario, quiero agregar notas a mis jornadas para recordar qué hice cada día | 3 |

### 4.2 Velocidad Estimada del Equipo

- **Capacidad por sprint:** ~30 puntos de historia
- **Total de puntos:** ~107 puntos
- **Sprints necesarios para funcionalidad:** ~4 sprints
- **+ 2 sprints para testing, refinamiento y deploy**

---

## 5. Sprint Planning

### Sprint 1: Configuración y Autenticación (Semana 1–2)

**Objetivo:** Levantar el proyecto con Next.js, configurar Supabase, implementar autenticación completa.

| Tarea | Asignado a | Estado | Puntos |
|-------|-----------|--------|--------|
| Crear proyecto Next.js 14 con TypeScript | Dev 1 | ✅ Completado | 2 |
| Configurar Tailwind CSS + tema custom | Dev 1 | ✅ Completado | 3 |
| Configurar Supabase (proyecto + tablas) | Dev 2 | ✅ Completado | 3 |
| Crear esquema de base de datos completo | Dev 2 | ✅ Completado | 5 |
| Implementar registro de usuario | Dev 2 | ✅ Completado | 3 |
| Implementar login/logout | Dev 2 | ✅ Completado | 3 |
| Recuperación de contraseña | Dev 2 | ✅ Completado | 2 |
| Login con Google (OAuth) | Dev 2 | ✅ Completado | 3 |
| Layout principal (Navbar, Sidebar) | Dev 1 | ✅ Completado | 5 |
| Protección de rutas (middleware) | Dev 2 | ✅ Completado | 3 |
| **Sprint Review & Retrospective** | Scrum Master | ✅ Completado | — |

**Resultado del Sprint 1:** Aplicación base funcionando, usuarios pueden registrarse, iniciar sesión y navegar el layout protegido.

---

### Sprint 2: Funcionalidad Core (Semana 3–4)

**Objetivo:** Implementar registro de jornadas, pausas y el timer en tiempo real.

| Tarea | Asignado a | Estado | Puntos |
|-------|-----------|--------|--------|
| Componente TimeTracker (timer en vivo) | Dev 1 | ✅ Completado | 5 |
| Servicio de sesiones (CRUD) | Dev 2 | ✅ Completado | 5 |
| Botón iniciar/finalizar jornada | Dev 1 | ✅ Completado | 3 |
| Sistema de pausas (UI) | Dev 1 | ✅ Completado | 5 |
| Servicio de pausas (backend) | Dev 2 | ✅ Completado | 3 |
| Cálculo automático de horas netas | Dev 2 | ✅ Completado | 3 |
| Dashboard principal (layout + widgets) | Dev 1 | ✅ Completado | 8 |
| Quick Stats (estadísticas rápidas) | Dev 1 | ✅ Completado | 3 |
| **Sprint Review & Retrospective** | Scrum Master | ✅ Completado | — |

**Resultado del Sprint 2:** Los usuarios pueden iniciar jornada, tomar pausas, ver el timer en vivo.

---

### Sprint 3: Visualización y Reportes (Semana 5–6)

**Objetivo:** Historial, calendario, gráficos de productividad.

| Tarea | Asignado a | Estado | Puntos |
|-------|-----------|--------|--------|
| Historial de jornadas (lista + filtros) | Dev 1 | ✅ Completado | 8 |
| Calendario de asistencia interactivo | Dev 1 | ✅ Completado | 8 |
| Gráficos de productividad (Recharts) | Dev 1 | ✅ Completado | 5 |
| Gráfico distribución de pausas (pie) | Dev 1 | ✅ Completado | 3 |
| Tendencias semanales (line chart) | Dev 1 | ✅ Completado | 3 |
| Views de estadísticas en BD | Dev 2 | ✅ Completado | 3 |
| Servicio de reportes | Dev 2 | ✅ Completado | 5 |
| **Sprint Review & Retrospective** | Scrum Master | ✅ Completado | — |

**Resultado del Sprint 3:** Dashboard completo con gráficos, calendario visual y reportes base.

---

### Sprint 4: Features Avanzadas (Semana 7–8)

**Objetivo:** Reportes exportables, proyectos, notificaciones, modo offline.

| Tarea | Asignado a | Estado | Puntos |
|-------|-----------|--------|--------|
| Exportación a PDF (jsPDF) | Dev 1 | ✅ Completado | 5 |
| Exportación a CSV | Dev 2 | ✅ Completado | 3 |
| Sistema de proyectos (CRUD) | Dev 2 | ✅ Completado | 5 |
| Notificaciones / recordatorios | Dev 1 | ✅ Completado | 5 |
| Modo offline (PWA + sync) | Dev 2 | ✅ Completado | 8 |
| Notas en jornadas | Dev 1 | ✅ Completado | 3 |
| Configuración de perfil | Dev 1 | ✅ Completado | 5 |
| Tema oscuro/claro | Dev 1 | ✅ Completado | 3 |
| **Sprint Review & Retrospective** | Scrum Master | ✅ Completado | — |

**Resultado del Sprint 4:** Todas las funcionalidades implementadas, PWA configurada.

---

### Sprint 5: Testing y Refinamiento (Semana 9–10)

**Objetivo:** Cobertura de tests > 80%, corrección de bugs, optimización de rendimiento.

| Tarea | Asignado a | Estado | Puntos |
|-------|-----------|--------|--------|
| Tests unitarios (Vitest) | Dev 2 | ✅ Completado | 8 |
| Tests de integración | Dev 2 | ✅ Completado | 5 |
| Tests E2E (Playwright) | Dev 1 | ✅ Completado | 8 |
| Corrección de bugs encontrados | Dev 1 + Dev 2 | ✅ Completado | 5 |
| Optimización de rendimiento | Dev 1 | ✅ Completado | 5 |
| Accesibilidad (WCAG 2.1 AA) | Dev 1 | ✅ Completado | 3 |
| **Sprint Review & Retrospective** | Scrum Master | ✅ Completado | — |

**Resultado del Sprint 5:** Aplicación estable, testeada y optimizada.

---

### Sprint 6: Deploy y Documentación (Semana 11–12)

**Objetivo:** Deploy a producción, documentación completa, preparación para entrega.

| Tarea | Asignado a | Estado | Puntos |
|-------|-----------|--------|--------|
| Deploy a Vercel | Dev 2 | ✅ Completado | 3 |
| Configuración de Supabase Cloud | Dev 2 | ✅ Completado | 3 |
| Documentación SRS | Product Owner | ✅ Completado | 5 |
| Documentación técnica (README) | Dev 1 + Dev 2 | ✅ Completado | 3 |
| Grabación del video | Todo el equipo | ✅ Completado | — |
| Preparación de presentación | Scrum Master | ✅ Completado | — |
| Revisión final del proyecto | Product Owner | ✅ Completado | — |
| **Sprint Review Final** | Todo el equipo | ✅ Completado | — |

**Resultado del Sprint 6:** Producto en producción, documentación completa, video grabado.

---

## 6. Actividades por Rol

### 🎯 Scrum Master

| # | Actividad | Descripción |
|---|----------|-------------|
| 1 | Facilitar Sprint Planning | Coordinar la reunión de planificación al inicio de cada sprint |
| 2 | Facilitar Daily Standups | Moderar las reuniones diarias de 15 minutos |
| 3 | Facilitar Sprint Reviews | Organizar las demos al final de cada sprint |
| 4 | Facilitar Retrospectivas | Guiar la retrospectiva para mejora continua |
| 5 | Eliminar impedimentos | Resolver bloqueos que impidan el avance del equipo |
| 6 | Mantener el tablero Scrum | Actualizar el estado de las tareas (To Do, In Progress, Done) |
| 7 | Generar métricas | Burndown charts, velocidad del equipo, cumplimiento |
| 8 | Proteger al equipo | Asegurar que no haya interrupciones o cambios de alcance sin control |

### 📦 Product Owner

| # | Actividad | Descripción |
|---|----------|-------------|
| 1 | Definir la visión del producto | Establecer qué es TimeTrack Pro y qué problema resuelve |
| 2 | Crear y priorizar el Product Backlog | Escribir historias de usuario y ordenarlas por valor |
| 3 | Definir criterios de aceptación | Especificar cuándo una historia está "terminada" |
| 4 | Validar entregas | Revisar y aprobar (o rechazar) el trabajo entregado |
| 5 | Comunicar con stakeholders | Representar al usuario/cliente ante el equipo |
| 6 | Refinar historias de usuario | Desglosar historias grandes en más pequeñas |
| 7 | Escribir el documento SRS | Documentación de Especificación de Requerimientos |
| 8 | Participar en Sprint Reviews | Verificar que el incremento cumple los criterios |

### 💻 Developer 1 (Frontend)

| # | Actividad | Descripción |
|---|----------|-------------|
| 1 | Configurar proyecto Next.js | Setup inicial con TypeScript y Tailwind CSS |
| 2 | Diseñar sistema de componentes | Crear componentes reutilizables (buttons, cards, inputs) |
| 3 | Implementar layout principal | Navbar, sidebar, footer responsive |
| 4 | Desarrollar TimeTracker | Componente principal con timer en vivo |
| 5 | Implementar dashboard | Panel con widgets, estadísticas y accesos rápidos |
| 6 | Crear vistas de historial y calendario | Listas filtradas y calendario interactivo |
| 7 | Implementar gráficos (Recharts) | Gráficos de productividad, distribución, tendencias |
| 8 | Exportación a PDF | Generación de reportes descargables |
| 9 | Diseño responsive | Adaptar toda la UI a móvil, tablet y desktop |
| 10 | Animaciones (Framer Motion) | Transiciones suaves, micro-animaciones |
| 11 | Tests E2E (Playwright) | Pruebas de flujo completo en el navegador |
| 12 | Tema oscuro/claro | Implementar toggle de tema |

### 💻 Developer 2 (Backend)

| # | Actividad | Descripción |
|---|----------|-------------|
| 1 | Configurar Supabase | Crear proyecto, configurar credenciales |
| 2 | Diseñar esquema de BD | Tablas: users, work_sessions, breaks, projects, user_preferences |
| 3 | Implementar RLS (Row Level Security) | Políticas de seguridad a nivel de fila |
| 4 | Crear funciones de BD | Cálculos automáticos, triggers, views |
| 5 | Sistema de autenticación | Registro, login, logout, OAuth con Google |
| 6 | Middleware de protección de rutas | Validar tokens JWT en cada request |
| 7 | Servicios de datos | session-service, break-service, report-service, user-service |
| 8 | Custom hooks | use-session, use-timer, use-breaks, use-statistics |
| 9 | Modo offline + sincronización | IndexedDB + sync automática al recuperar conexión |
| 10 | Exportación a CSV | Generación de archivos CSV con datos de jornadas |
| 11 | Tests unitarios e integración (Vitest) | Pruebas de services, hooks y utilidades |
| 12 | Deploy a Vercel + Supabase Cloud | Configurar CI/CD y producción |

---

## 7. Evidencias de Desarrollo

### 7.1 Estructura del Proyecto Implementado

```
timetrack-pro/
├── src/
│   ├── app/              # Páginas (Next.js App Router)
│   │   ├── (auth)/       # Login, Register, Reset Password
│   │   └── (dashboard)/  # Dashboard, History, Calendar, Reports, Analytics, Settings
│   ├── components/       # Componentes React reutilizables
│   │   ├── ui/           # Button, Card, Input, Dialog...
│   │   ├── dashboard/    # TimeTracker, QuickStats, WeeklyChart
│   │   ├── calendar/     # CalendarView, DayDetails
│   │   ├── reports/      # ReportGenerator, ExportOptions
│   │   ├── analytics/    # ProductivityChart, TimeDistribution, TrendsGraph
│   │   └── layout/       # Navbar, Sidebar, Footer
│   ├── hooks/            # Custom hooks (use-session, use-timer, use-breaks...)
│   ├── lib/              # Utilidades y configuración de Supabase
│   ├── services/         # Servicios de datos (CRUD operations)
│   ├── stores/           # Estado global con Zustand
│   └── types/            # Interfaces TypeScript
├── supabase/             # Migraciones y seed de BD
├── tests/                # Tests unitarios, integración y E2E
├── public/               # Assets estáticos
└── tailwind.config.ts    # Configuración del tema
```

### 7.2 Modelo de Datos Implementado

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    users     │     │  work_sessions   │     │    breaks    │
├──────────────┤     ├──────────────────┤     ├──────────────┤
│ id (PK)      │◄────│ user_id (FK)     │     │ id (PK)      │
│ email        │     │ id (PK)          │◄────│ session_id   │
│ full_name    │     │ start_time       │     │ break_type   │
│ avatar_url   │     │ end_time         │     │ start_time   │
│ expected_hrs │     │ total_break_min  │     │ end_time     │
│ timezone     │     │ net_work_min     │     │ duration_min │
└──────────────┘     │ notes            │     │ notes        │
       │             │ project_id (FK)  │     └──────────────┘
       │             └──────────────────┘
       │                      │
       ▼                      ▼
┌──────────────┐     ┌──────────────────┐
│ preferences  │     │    projects      │
├──────────────┤     ├──────────────────┤
│ user_id (FK) │     │ id (PK)          │
│ theme        │     │ user_id (FK)     │
│ notifs       │     │ name             │
│ break_remind │     │ description      │
│ language     │     │ color            │
└──────────────┘     │ is_active        │
                     └──────────────────┘
```

### 7.3 Pantallas Principales

1. **Login / Registro** — Formularios con validación, OAuth con Google
2. **Dashboard** — Timer en vivo, estadísticas rápidas, gráfico semanal, sesiones recientes
3. **Historial** — Lista con filtros por fecha, búsqueda, paginación
4. **Calendario** — Vista mensual con código de colores por estado
5. **Reportes** — Generador de reportes con exportación PDF/CSV
6. **Analytics** — Gráficos de productividad, distribución, tendencias
7. **Configuración** — Perfil, horario esperado, tema, notificaciones

---

## 8. Preguntas y Respuestas del Proyecto

### P1: ¿Por qué eligieron Next.js en lugar de React puro o Angular?
**R:** Next.js ofrece Server-Side Rendering (SSR), Server Components, App Router con layouts anidados, optimización automática de imágenes, y una experiencia de desarrollo superior. Además, se despliega fácilmente en Vercel con CI/CD automático. React puro no tiene SSR nativo y Angular tiene una curva de aprendizaje más pronunciada para un equipo pequeño.

### P2: ¿Por qué Supabase y no Firebase o un backend propio?
**R:** Supabase utiliza PostgreSQL (base de datos relacional robusta), ofrece Row Level Security para seguridad granular, tiene autenticación integrada, y es open source. Firebase usa NoSQL lo cual dificulta queries relacionales complejas. Un backend propio habría requerido más tiempo de desarrollo.

### P3: ¿Cómo manejan la seguridad de los datos?
**R:** Implementamos múltiples capas:
- **RLS (Row Level Security):** Cada usuario solo ve y modifica sus propios datos
- **JWT Tokens:** Autenticación segura con tokens firmados
- **HTTPS:** Toda la comunicación está encriptada
- **Validación con Zod:** Validación de datos tanto en cliente como servidor
- **Middleware de protección:** Rutas del dashboard inaccesibles sin autenticación

### P4: ¿Cómo funciona el modo offline?
**R:** Usamos la API de Service Workers (PWA) junto con IndexedDB para almacenar datos localmente. Cuando el usuario pierde conexión, los registros se guardan localmente. Al recuperar la conexión, se sincronizan automáticamente con Supabase, manejando posibles conflictos de datos.

### P5: ¿Cómo aplicaron Scrum en un equipo de solo 4 personas?
**R:** Scrum es ideal para equipos de 3–9 personas. Con 4 integrantes, cada rol tiene responsabilidades claras. El Scrum Master y Product Owner también pueden colaborar en tareas técnicas menores cuando es necesario. Las ceremonias se mantuvieron cortas y enfocadas.

### P6: ¿Cómo se distribuyeron el trabajo los dos developers?
**R:** Separamos por capas: **Developer 1** se especializó en frontend (componentes, UI/UX, responsive, animaciones) y **Developer 2** en backend (Supabase, base de datos, servicios, autenticación). Esto evitó conflictos de merge y permitió trabajo paralelo eficiente.

### P7: ¿Qué tipos de pruebas realizaron?
**R:** Tres niveles de testing:
- **Unitarias (Vitest):** Funciones de utilidad, cálculos de tiempo, transformaciones de datos
- **Integración (Vitest):** Servicios interactuando con Supabase, hooks custom
- **E2E (Playwright):** Flujos completos como registro → login → iniciar jornada → tomar pausa → finalizar → ver reporte

### P8: ¿Cómo hicieron el diseño responsive?
**R:** Utilizamos **Tailwind CSS** con breakpoints definidos (sm: 640px, md: 768px, lg: 1024px, xl: 1280px). El enfoque fue **mobile-first**: primero diseñamos para móvil y luego adaptamos para pantallas más grandes. Todos los componentes se probaron en Chrome DevTools con diferentes resoluciones.

### P9: ¿Qué impedimentos encontraron durante el desarrollo?
**R:** Los principales impedimentos fueron:
- Configuración inicial de RLS en Supabase (resuelto con documentación oficial)
- Sincronización offline (resuelto con IndexedDB + estrategia de reconciliación)
- Rendimiento de gráficos con muchos datos (resuelto con prefetching y caching)
- Diseño responsive del calendario (resuelto con CSS Grid dinámico)

### P10: ¿Qué mejorarían si tuvieran más tiempo?
**R:** 
- Implementar notificaciones push reales con Web Push API
- Agregar roles de administrador para gestionar equipos
- Integración con calendarios externos (Google Calendar, Outlook)
- App nativa con React Native para mejor experiencia móvil
- Dashboard para managers con vista de todo el equipo

---

## 9. Guion del Video de Presentación

### 📹 Información del Video

- **Duración estimada:** 8–12 minutos
- **Participantes:** 4 (Scrum Master, Product Owner, Developer 1, Developer 2)
- **Formato:** Presentación + Demo en vivo de la aplicación

---

### 🎬 ESCENA 1 — Introducción (1 minuto)

**[En pantalla: Logo/título "TimeTrack Pro - Sistema de Control Horario"]**

**SCRUM MASTER:**
> "Hola, bienvenidos a la presentación de nuestro proyecto final. Somos el equipo de TimeTrack Pro, un sistema de control y gestión de horarios laborales. Mi nombre es [NOMBRE], soy el Scrum Master del equipo, y me encargo de facilitar la metodología ágil y asegurar que el equipo trabaje de manera eficiente."

**[En pantalla: Los 4 integrantes del equipo con sus nombres y roles]**

**SCRUM MASTER:**
> "Permítanme presentar al equipo:
> - [NOMBRE], nuestro Product Owner, que definió la visión del producto
> - [NOMBRE], Developer Frontend, responsable de toda la interfaz de usuario
> - [NOMBRE], Developer Backend, responsable de la base de datos y la lógica del servidor
> - Y yo como Scrum Master, facilitando las ceremonias y eliminando impedimentos."

---

### 🎬 ESCENA 2 — El Problema y la Solución (1.5 minutos)

**PRODUCT OWNER:**
> "Gracias. Antes de mostrarles la aplicación, quiero explicar el problema que resolvemos."

> "Muchos trabajadores, especialmente freelancers y empleados remotos, no tienen una forma sencilla de registrar sus horas de trabajo. Usan hojas de Excel, notas en papel, o simplemente no las registran. Esto genera problemas para facturación, rendición de cuentas, y gestión del tiempo personal."

> "Nuestra solución es **TimeTrack Pro**: una aplicación web que permite registrar jornadas laborales con un solo clic, gestionar pausas, visualizar estadísticas de productividad y exportar reportes profesionales."

> "El producto está dirigido a empleados, freelancers y equipos pequeños que necesiten llevar un control de sus horas trabajadas de manera profesional."

---

### 🎬 ESCENA 3 — Metodología Scrum (2 minutos)

**SCRUM MASTER:**
> "Ahora les explicaré cómo organizamos el desarrollo usando la metodología Scrum."

**[En pantalla: Diagrama del proceso Scrum]**

> "Dividimos el proyecto en **6 sprints de 2 semanas** cada uno. En cada sprint realizamos las 4 ceremonias de Scrum:"

> "Primero, el **Sprint Planning**, donde el Product Owner nos presentaba las historias de usuario priorizadas y entre todos estimábamos la complejidad con puntos de historia."

> "Cada día teníamos un **Daily Standup** de 15 minutos donde cada miembro respondía tres preguntas: qué hice ayer, qué haré hoy, y si tengo algún impedimento."

> "Al final de cada sprint hacíamos un **Sprint Review** donde demostrábamos el incremento funcional al Product Owner, quien validaba si cumplíamos los criterios de aceptación."

> "Y finalmente la **Retrospectiva**, donde discutíamos qué salió bien, qué podíamos mejorar, y definíamos acciones concretas para el siguiente sprint."

**[En pantalla: Burndown chart o tablero Scrum]**

> "La velocidad promedio del equipo fue de aproximadamente 30 puntos por sprint, y completamos un total de 107 puntos de historia a lo largo del proyecto."

---

### 🎬 ESCENA 4 — Demo de la Aplicación (4 minutos)

**DEVELOPER 1:**
> "Ahora vamos a hacer una demo en vivo de TimeTrack Pro. Voy a compartir mi pantalla."

**[En pantalla: Aplicación corriendo en el navegador]**

#### 4a. Autenticación (30 seg)
> "Primero tenemos la pantalla de login. El usuario puede registrarse con email y contraseña, o iniciar sesión directamente con Google gracias a OAuth. Voy a iniciar sesión con una cuenta de prueba..."

**[Hace login y entra al dashboard]**

#### 4b. Dashboard (45 seg)
> "Este es el dashboard principal. Pueden ver el **timer grande** en el centro — está listo para iniciar una jornada. Abajo tenemos las **estadísticas rápidas**: horas trabajadas esta semana, promedio diario, días trabajados, y horas extras. Y aquí un **gráfico semanal** con la distribución de horas."

#### 4c. Iniciar Jornada y Pausas (45 seg)
> "Voy a hacer clic en 'Iniciar Jornada'..."

**[Clic en el botón — el timer comienza a correr]**

> "Como ven, el timer comenzó a contar en tiempo real. El estado cambió a 'Trabajando'. Ahora voy a tomar una pausa de tipo 'Descanso'..."

**[Clic en pausa — se detiene el timer de trabajo, inicia timer de pausa]**

> "El sistema registra la pausa. Puedo seleccionar entre almuerzo, descanso corto o personal. Voy a finalizar la pausa..."

**[Finaliza pausa — el timer de trabajo se reanuda]**

#### 4d. Historial y Calendario (45 seg)

**DEVELOPER 2:**
> "Ahora les muestro las secciones que desarrollé junto con Developer 1. Aquí tenemos el **historial de jornadas** con todas las sesiones registradas. Podemos filtrar por fecha, buscar por notas, y ver los detalles de cada jornada incluyendo las pausas."

**[Navega al calendario]**

> "El **calendario de asistencia** muestra los días trabajados en verde, los días de ausencia, y los días del fin de semana. Si hago clic en un día, puedo ver los detalles de esa jornada."

#### 4e. Reportes y Analytics (45 seg)

> "En la sección de **Analytics** tenemos gráficos interactivos: tendencias de productividad semanal, distribución de horas por día, y un gráfico circular con los tipos de pausas."

> "En **Reportes**, el usuario puede seleccionar un rango de fechas y exportar sus datos a PDF o CSV. Esto es útil para freelancers que necesitan facturar o empleados que deben reportar horas."

**[Genera un reporte y lo descarga]**

#### 4f. Responsive y Tema (30 seg)
> "Finalmente, la aplicación es completamente responsive..."

**[Abre DevTools y cambia la resolución a móvil]**

> "Como ven, se adapta perfectamente a pantallas de celular. Y también tenemos modo oscuro..."

**[Cambia el tema a dark mode]**

> "Todo funciona perfectamente en ambos temas."

---

### 🎬 ESCENA 5 — Aspectos Técnicos (1.5 minutos)

**DEVELOPER 2:**
> "Quiero destacar algunos aspectos técnicos importantes del proyecto."

**[En pantalla: Diagrama de arquitectura]**

> "Usamos **Next.js 14** con App Router y Server Components para un rendimiento óptimo. La base de datos es **PostgreSQL** a través de **Supabase**, con Row Level Security para que cada usuario solo acceda a sus propios datos."

> "Implementamos la autenticación con JWT tokens almacenados en httpOnly cookies, y middleware que protege todas las rutas del dashboard."

> "Para el estado global usamos **Zustand**, una librería minimalista, y **React Query** para el caché inteligente de datos del servidor. Esto hace que la aplicación se sienta instantánea porque los datos se cachean y se actualizan en segundo plano."

> "Además, la app funciona como **PWA** (Progressive Web App), lo que significa que puede funcionar offline y se puede instalar como una app nativa en el celular."

---

### 🎬 ESCENA 6 — Lecciones Aprendidas y Conclusión (1.5 minutos)

**PRODUCT OWNER:**
> "Para cerrar, quiero hablar de las lecciones aprendidas."

> "Primero, la importancia de **definir bien los criterios de aceptación** desde el inicio. Esto evitó malentendidos y retrabajos."

> "Segundo, la **separación clara de responsabilidades** entre frontend y backend permitió que ambos developers trabajaran en paralelo sin conflictos."

> "Tercero, **Scrum realmente funciona** para equipos pequeños. Las dailys nos mantuvieron sincronizados y las retrospectivas nos ayudaron a mejorar sprint tras sprint."

**SCRUM MASTER:**
> "Como Scrum Master, puedo confirmar que la metodología nos mantuvo enfocados y organizados. Los impedimentos principales fueron técnicos (configuración de Supabase, manejo offline), pero se resolvieron rápidamente gracias a la comunicación constante del equipo."

> "En resumen, TimeTrack Pro es un producto completo, funcional y profesional que demuestra no solo nuestras habilidades técnicas, sino también nuestra capacidad de trabajar como un equipo ágil."

**[Todos:]**
> "¡Gracias por su atención! Estamos abiertos a preguntas."

---

### 🎬 ESCENA 7 — Preguntas Anticipadas (para referencia)

En caso de que hagan preguntas durante o después del video:

| Pregunta Probable | Quién Responde |
|-------------------|----------------|
| ¿Cómo eligieron las tecnologías? | Product Owner |
| ¿Cómo fue el proceso de Scrum? | Scrum Master |
| ¿Cómo funciona la autenticación? | Developer 2 |
| ¿Cómo hicieron el diseño responsive? | Developer 1 |
| ¿Qué fue lo más difícil? | Developer 1 o Developer 2 |
| ¿Cómo manejan la seguridad? | Developer 2 |
| ¿Qué mejorarían? | Product Owner |
| ¿Qué pruebas hicieron? | Developer 2 |

---

## 10. Conclusiones

### 10.1 Objetivos Cumplidos

✅ Aplicación web funcional de control horario  
✅ Autenticación segura con Supabase  
✅ Registro de jornadas y pausas en tiempo real  
✅ Dashboard interactivo con estadísticas  
✅ Calendario de asistencia visual  
✅ Reportes exportables (PDF/CSV)  
✅ Gráficos de productividad  
✅ Diseño responsive (mobile-first)  
✅ Modo oscuro/claro  
✅ Progressive Web App (offline capable)  
✅ Metodología Scrum aplicada correctamente  
✅ Documentación completa (SRS)  

### 10.2 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| Sprints completados | 6 |
| Historias de usuario entregadas | 15 |
| Puntos de historia completados | 107 |
| Velocidad promedio por sprint | ~30 pts |
| Archivos de código fuente | 86+ |
| Cobertura de tests | > 80% |
| Lighthouse Performance Score | > 90 |

### 10.3 Aprendizajes Clave

1. **Scrum es efectivo** para equipos pequeños con comunicación constante
2. **TypeScript + Next.js** ofrecen una experiencia de desarrollo robusta y segura
3. **Supabase** simplifica enormemente el backend sin sacrificar la potencia de PostgreSQL
4. **Tailwind CSS** permite prototipado rápido y consistencia visual
5. **La documentación es clave** — el documento SRS guió todo el desarrollo
6. **Testing temprano** ahorra tiempo al final del proyecto
7. **La separación de responsabilidades** (frontend/backend) maximiza la productividad en paralelo

---

*Documento generado para el proyecto final — TimeTrack Pro*  
*Equipo: Scrum Master, Product Owner, Developer 1, Developer 2*  
*Fecha: Febrero 2026*
