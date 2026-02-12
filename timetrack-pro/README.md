# Documento de Especificación de Requerimientos de Software (SRS)
## Aplicación de Control Horario

---

**Versión:** 1.0  
**Fecha:** 11 de Febrero, 2026  
**Proyecto:** Sistema de Control y Gestión de Horarios Laborales  
**Estado:** Aprobado para Desarrollo

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Descripción General](#2-descripción-general)
3. [Requerimientos Funcionales](#3-requerimientos-funcionales)
4. [Requerimientos No Funcionales](#4-requerimientos-no-funcionales)
5. [Arquitectura del Sistema](#5-arquitectura-del-sistema)
6. [Stack Tecnológico](#6-stack-tecnológico)
7. [Modelo de Datos](#7-modelo-de-datos)
8. [Especificaciones de UI/UX](#8-especificaciones-de-uiux)
9. [Seguridad y Autenticación](#9-seguridad-y-autenticación)
10. [Casos de Uso](#10-casos-de-uso)
11. [Cronograma de Desarrollo](#11-cronograma-de-desarrollo)
12. [Glosario](#12-glosario)

---

## 1. Introducción

### 1.1 Propósito
Este documento especifica los requerimientos para el desarrollo de una aplicación web de control horario laboral. El sistema permitirá a los usuarios registrar sus jornadas de trabajo, gestionar pausas y generar reportes detallados de tiempo trabajado.

### 1.2 Alcance
La aplicación "TimeTrack Pro" es un sistema de gestión de tiempo laboral que proporciona:
- Registro de entradas y salidas
- Gestión de pausas y descansos
- Cálculo automático de horas trabajadas
- Generación de reportes visuales e históricos
- Dashboard interactivo con estadísticas
- Sistema de autenticación seguro
- Soporte multi-dispositivo (responsive design)

### 1.3 Usuarios Objetivo
- Empleados que necesitan registrar su tiempo de trabajo
- Freelancers y trabajadores remotos
- Equipos pequeños y medianos
- Gestores que necesitan supervisar tiempos de trabajo

### 1.4 Referencias
- Documentación de Next.js 14+
- Documentación de Supabase
- Documentación de Tailwind CSS 3.4.19
- Estándares de accesibilidad WCAG 2.1

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
TimeTrack Pro es una aplicación web standalone que funciona como PWA (Progressive Web App), permitiendo uso tanto en navegadores de escritorio como en dispositivos móviles. Utiliza Supabase como backend-as-a-service para autenticación y almacenamiento de datos.

### 2.2 Funciones Principales
1. **Gestión de Sesiones de Trabajo**
   - Iniciar jornada laboral
   - Finalizar jornada laboral
   - Registro automático de timestamps

2. **Gestión de Pausas**
   - Iniciar pausa/descanso
   - Finalizar pausa
   - Tipos de pausas (almuerzo, descanso corto, personal)

3. **Dashboard y Visualización**
   - Resumen de jornada actual
   - Estadísticas semanales/mensuales
   - Gráficos de productividad
   - Calendarios de asistencia

4. **Reportes**
   - Exportación de datos (CSV, PDF)
   - Reportes personalizados por rango de fechas
   - Análisis de horas extras
   - Comparativas históricas

5. **Perfil de Usuario**
   - Configuración de horario laboral esperado
   - Preferencias de notificaciones
   - Gestión de cuenta

### 2.3 Características de los Usuarios
- Nivel de experiencia: Básico a intermedio en aplicaciones web
- Acceso a internet estable
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Opcional: Dispositivo móvil iOS/Android

### 2.4 Restricciones
- Debe funcionar sin conexión (offline-first con sincronización)
- Tiempo de respuesta máximo de 2 segundos para operaciones críticas
- Soporte para navegadores de los últimos 2 años
- Cumplimiento con GDPR para datos personales

---

## 3. Requerimientos Funcionales

### RF-001: Autenticación de Usuarios
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir registro, login y recuperación de contraseña.

**Criterios de Aceptación:**
- Los usuarios pueden registrarse con email y contraseña
- Validación de email mediante confirmación
- Login con credenciales válidas
- Recuperación de contraseña vía email
- Opción de login con proveedores OAuth (Google)
- Sesión persistente con tokens JWT
- Logout seguro con limpieza de tokens

---

### RF-002: Registro de Entrada
**Prioridad:** Alta  
**Descripción:** Los usuarios pueden registrar el inicio de su jornada laboral.

**Criterios de Aceptación:**
- Botón claramente visible para "Iniciar Jornada"
- Registro automático de timestamp al hacer clic
- Confirmación visual del registro exitoso
- Bloqueo del botón si ya existe una jornada activa
- Geolocalización opcional del registro

---

### RF-003: Registro de Salida
**Prioridad:** Alta  
**Descripción:** Los usuarios pueden registrar el fin de su jornada laboral.

**Criterios de Aceptación:**
- Botón claramente visible para "Finalizar Jornada"
- Registro automático de timestamp
- Cálculo inmediato de horas trabajadas
- Confirmación con resumen de la jornada
- Validación de que existe una entrada previa

---

### RF-004: Gestión de Pausas
**Prioridad:** Alta  
**Descripción:** Sistema de registro de pausas durante la jornada laboral.

**Criterios de Aceptación:**
- Botón para iniciar pausa (solo disponible durante jornada activa)
- Botón para finalizar pausa
- Selección de tipo de pausa (almuerzo, descanso, personal)
- Cálculo de tiempo total en pausas
- Múltiples pausas por jornada
- Visualización de pausas activas

---

### RF-005: Cálculo Automático de Horas
**Prioridad:** Alta  
**Descripción:** El sistema calcula automáticamente el tiempo trabajado.

**Criterios de Aceptación:**
- Cálculo de tiempo bruto trabajado (entrada a salida)
- Deducción automática del tiempo de pausas
- Cálculo de tiempo neto trabajado
- Identificación de horas extras (si excede jornada configurada)
- Actualización en tiempo real durante jornada activa

---

### RF-006: Dashboard Principal
**Prioridad:** Alta  
**Descripción:** Panel central con información relevante y accesos rápidos.

**Criterios de Aceptación:**
- Vista de jornada actual con timer en vivo
- Resumen de horas de la semana
- Gráfico de distribución de tiempo
- Accesos rápidos a funciones principales
- Indicadores de estado (trabajando, en pausa, fuera de jornada)
- Notificaciones y alertas relevantes

---

### RF-007: Historial de Jornadas
**Prioridad:** Media  
**Descripción:** Visualización de todas las jornadas registradas.

**Criterios de Aceptación:**
- Lista cronológica de jornadas
- Filtros por fecha (día, semana, mes, personalizado)
- Búsqueda por palabras clave o notas
- Ordenamiento por fecha, duración
- Paginación o scroll infinito
- Detalles expandibles de cada jornada

---

### RF-008: Calendario de Asistencia
**Prioridad:** Media  
**Descripción:** Vista de calendario con indicadores de asistencia.

**Criterios de Aceptación:**
- Calendario mensual interactivo
- Código de colores por estado (trabajado, ausente, día libre)
- Indicador de cumplimiento de horas esperadas
- Navegación entre meses
- Click en día para ver detalles
- Leyenda clara de códigos de color

---

### RF-009: Generación de Reportes
**Prioridad:** Media  
**Descripción:** Creación de reportes detallados de tiempo trabajado.

**Criterios de Aceptación:**
- Selección de rango de fechas
- Opción de exportar a CSV
- Opción de exportar a PDF
- Inclusión de gráficos en reportes
- Resumen ejecutivo (total horas, promedio, extras)
- Desglose por día/semana
- Comparativas con períodos anteriores

---

### RF-010: Estadísticas y Analytics
**Prioridad:** Media  
**Descripción:** Visualización de métricas y tendencias de productividad.

**Criterios de Aceptación:**
- Gráfico de líneas de horas trabajadas por semana
- Gráfico de barras de distribución diaria
- Gráfico circular de tipos de pausas
- Métricas de cumplimiento de objetivos
- Tendencias y comparativas
- Identificación de patrones (días más productivos)

---

### RF-011: Perfil y Configuración
**Prioridad:** Media  
**Descripción:** Gestión de datos de usuario y preferencias.

**Criterios de Aceptación:**
- Edición de nombre y avatar
- Configuración de jornada laboral esperada
- Configuración de zona horaria
- Preferencias de notificaciones
- Cambio de contraseña
- Eliminación de cuenta
- Tema claro/oscuro

---

### RF-012: Notificaciones
**Prioridad:** Baja  
**Descripción:** Sistema de alertas y recordatorios.

**Criterios de Aceptación:**
- Notificación al olvidar registrar salida
- Recordatorio de pausas prolongadas
- Alerta de horas extras excesivas
- Notificaciones push (opcional)
- Centro de notificaciones en la app
- Configuración de preferencias de notificaciones

---

### RF-013: Notas en Jornadas
**Prioridad:** Baja  
**Descripción:** Capacidad de agregar notas a jornadas y pausas.

**Criterios de Aceptación:**
- Campo de texto para notas en jornadas
- Notas opcionales en pausas
- Edición de notas posteriores
- Búsqueda por contenido de notas
- Máximo 500 caracteres por nota

---

### RF-014: Modo Offline
**Prioridad:** Media  
**Descripción:** Funcionamiento básico sin conexión a internet.

**Criterios de Aceptación:**
- Registro de entradas/salidas offline
- Almacenamiento local de datos
- Sincronización automática al recuperar conexión
- Indicador visual de estado de conexión
- Manejo de conflictos en sincronización

---

### RF-015: Proyectos/Tareas
**Prioridad:** Baja  
**Descripción:** Asociación de jornadas a proyectos específicos.

**Criterios de Aceptación:**
- Creación y gestión de proyectos
- Asignación de jornada a proyecto
- Filtrado de reportes por proyecto
- Estadísticas por proyecto
- Etiquetas y categorización

---

## 4. Requerimientos No Funcionales

### RNF-001: Rendimiento
- Carga inicial de la aplicación: < 3 segundos
- Tiempo de respuesta de acciones del usuario: < 500ms
- Transiciones y animaciones: 60 FPS
- Optimización de imágenes y assets
- Code splitting y lazy loading

### RNF-002: Escalabilidad
- Soporte para 10,000+ usuarios concurrentes
- Manejo de 1M+ registros de jornadas
- Arquitectura modular y extensible
- Preparado para microservicios futuros

### RNF-003: Usabilidad
- Interfaz intuitiva con curva de aprendizaje mínima
- Diseño responsive (mobile-first)
- Compatibilidad con lectores de pantalla
- Atajos de teclado para funciones principales
- Mensajes de error claros y accionables

### RNF-004: Seguridad
- Encriptación de datos en tránsito (HTTPS)
- Encriptación de datos sensibles en reposo
- Autenticación mediante JWT
- Protección contra XSS, CSRF, SQL Injection
- Rate limiting en endpoints críticos
- Validación de datos en cliente y servidor

### RNF-005: Disponibilidad
- Uptime del 99.9%
- Backup automático diario de datos
- Plan de recuperación ante desastres
- Monitoreo proactivo de errores

### RNF-006: Mantenibilidad
- Código documentado y bien estructurado
- Tests unitarios (coverage > 80%)
- Tests de integración
- CI/CD pipeline automatizado
- Versionado semántico

### RNF-007: Portabilidad
- Funcional en Chrome, Firefox, Safari, Edge
- Progressive Web App (PWA)
- Instalable en dispositivos móviles
- Responsive design (320px - 4K)

### RNF-008: Accesibilidad
- Cumplimiento WCAG 2.1 nivel AA
- Navegación por teclado completa
- Contraste de colores adecuado
- Textos alternativos en imágenes
- Formularios accesibles

---

## 5. Arquitectura del Sistema

### 5.1 Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend)                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Next.js Application                    │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │ │
│  │  │  Pages   │  │Components│  │  Custom Hooks    │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │ │
│  │  │  Stores  │  │ Services │  │  Utilities       │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            │ API Calls (REST/GraphQL)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (Supabase)                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │              PostgreSQL Database                    │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │ │
│  │  │  Tables  │  │   Views  │  │    Functions     │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │            Authentication (Supabase Auth)           │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │            Storage (Supabase Storage)               │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Estructura de Directorios

```
timetrack-pro/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset-password/
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx                 # Dashboard principal
│   │   │   ├── history/
│   │   │   ├── calendar/
│   │   │   ├── reports/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── providers.tsx
│   ├── components/
│   │   ├── ui/                           # Componentes base reutilizables
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── dashboard/
│   │   │   ├── time-tracker.tsx
│   │   │   ├── quick-stats.tsx
│   │   │   ├── weekly-chart.tsx
│   │   │   └── recent-sessions.tsx
│   │   ├── history/
│   │   │   ├── session-list.tsx
│   │   │   ├── session-card.tsx
│   │   │   └── filters.tsx
│   │   ├── calendar/
│   │   │   ├── calendar-view.tsx
│   │   │   └── day-details.tsx
│   │   ├── reports/
│   │   │   ├── report-generator.tsx
│   │   │   ├── export-options.tsx
│   │   │   └── report-preview.tsx
│   │   ├── analytics/
│   │   │   ├── productivity-chart.tsx
│   │   │   ├── time-distribution.tsx
│   │   │   └── trends-graph.tsx
│   │   └── layout/
│   │       ├── navbar.tsx
│   │       ├── sidebar.tsx
│   │       └── footer.tsx
│   ├── hooks/
│   │   ├── use-session.ts
│   │   ├── use-timer.ts
│   │   ├── use-breaks.ts
│   │   ├── use-statistics.ts
│   │   └── use-theme.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   ├── utils/
│   │   │   ├── date-utils.ts
│   │   │   ├── time-calculations.ts
│   │   │   └── format-utils.ts
│   │   └── constants.ts
│   ├── services/
│   │   ├── session-service.ts
│   │   ├── break-service.ts
│   │   ├── report-service.ts
│   │   └── user-service.ts
│   ├── stores/
│   │   ├── session-store.ts
│   │   ├── user-store.ts
│   │   └── theme-store.ts
│   └── types/
│       ├── database.ts
│       ├── models.ts
│       └── api.ts
├── public/
│   ├── icons/
│   ├── images/
│   └── manifest.json
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local.example
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 5.3 Patrones de Diseño

#### 5.3.1 Componentes
- **Atomic Design:** Organización jerárquica (átomos → moléculas → organismos)
- **Composición sobre herencia:** Componentes reutilizables y combinables
- **Server Components por defecto:** Usar Client Components solo cuando sea necesario

#### 5.3.2 Estado
- **Zustand:** Para estado global ligero
- **React Query:** Para cache y sincronización de datos del servidor
- **Context API:** Para temas y preferencias de usuario

#### 5.3.3 Data Fetching
- **Server Actions:** Para mutaciones
- **React Query:** Para queries con cache inteligente
- **Optimistic Updates:** Para mejor UX

---

## 6. Stack Tecnológico

### 6.1 Frontend Framework
- **Next.js 14+** (App Router)
  - React Server Components
  - Server Actions
  - Streaming SSR
  - Route Handlers

### 6.2 Lenguaje
- **TypeScript 5+**
  - Strict mode
  - Type safety completo
  - Interfaces bien definidas

### 6.3 Styling
- **Tailwind CSS 3.4.19**
  - Utility-first approach
  - Custom design system
  - Dark mode support
  - Responsive design utilities

### 6.4 Backend & Database
- **Supabase**
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication & Authorization
  - Storage para archivos

### 6.5 Librerías Principales

#### UI Components
- **lucide-react:** Sistema de iconos moderno y consistente
- **shadcn/ui:** Componentes base accesibles y customizables

#### Charts & Visualización
- **recharts:** Gráficos interactivos y responsivos
- **react-day-picker:** Selector de fechas avanzado

#### Animaciones
- **framer-motion:** Animaciones fluidas y performantes

#### Notificaciones
- **sonner:** Toast notifications elegantes

#### Forms & Validation
- **react-hook-form:** Manejo eficiente de formularios
- **zod:** Validación de schemas con TypeScript

#### Estado & Data
- **zustand:** Estado global minimalista
- **@tanstack/react-query:** Server state management

#### Utilidades
- **date-fns:** Manipulación de fechas
- **clsx / tailwind-merge:** Merge condicional de clases CSS

#### PDF & Exportación
- **jspdf:** Generación de PDFs
- **react-to-print:** Impresión de componentes

### 6.6 Desarrollo & Testing
- **ESLint:** Linting
- **Prettier:** Code formatting
- **Vitest:** Unit testing
- **Playwright:** E2E testing
- **TypeScript:** Type checking

### 6.7 Deployment
- **Vercel:** Hosting y CI/CD
- **Supabase Cloud:** Backend infrastructure

---

## 7. Modelo de Datos

### 7.1 Esquema de Base de Datos

#### Tabla: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  expected_hours_per_day DECIMAL(4,2) DEFAULT 8.00,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla: `work_sessions`
```sql
CREATE TABLE work_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  total_break_minutes INTEGER DEFAULT 0,
  net_work_minutes INTEGER,
  notes TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_work_sessions_user_id ON work_sessions(user_id);
CREATE INDEX idx_work_sessions_start_time ON work_sessions(start_time);
```

#### Tabla: `breaks`
```sql
CREATE TABLE breaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_session_id UUID REFERENCES work_sessions(id) ON DELETE CASCADE,
  break_type TEXT NOT NULL CHECK (break_type IN ('lunch', 'short', 'personal')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_breaks_session_id ON breaks(work_session_id);
```

#### Tabla: `projects`
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
```

#### Tabla: `user_preferences`
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  break_reminders BOOLEAN DEFAULT TRUE,
  overtime_alerts BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'es',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7.2 Relaciones
- Un usuario puede tener múltiples sesiones de trabajo
- Una sesión de trabajo puede tener múltiples pausas
- Un usuario puede tener múltiples proyectos
- Una sesión puede estar asociada a un proyecto
- Un usuario tiene una configuración de preferencias

### 7.3 Row Level Security (RLS)

```sql
-- Users solo pueden ver y modificar sus propios datos
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON work_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON work_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON work_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON work_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Aplicar políticas similares a todas las tablas
```

### 7.4 Funciones de Base de Datos

```sql
-- Función para calcular minutos netos trabajados
CREATE OR REPLACE FUNCTION calculate_net_work_minutes(session_id UUID)
RETURNS INTEGER AS $$
DECLARE
  start_t TIMESTAMP;
  end_t TIMESTAMP;
  total_breaks INTEGER;
  gross_minutes INTEGER;
BEGIN
  SELECT start_time, end_time, total_break_minutes
  INTO start_t, end_t, total_breaks
  FROM work_sessions
  WHERE id = session_id;
  
  IF end_t IS NULL THEN
    RETURN NULL;
  END IF;
  
  gross_minutes := EXTRACT(EPOCH FROM (end_t - start_t)) / 60;
  RETURN gross_minutes - COALESCE(total_breaks, 0);
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar net_work_minutes automáticamente
CREATE OR REPLACE FUNCTION update_net_work_minutes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_time IS NOT NULL THEN
    NEW.net_work_minutes := calculate_net_work_minutes(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_net_work_minutes
BEFORE UPDATE ON work_sessions
FOR EACH ROW
WHEN (OLD.end_time IS DISTINCT FROM NEW.end_time)
EXECUTE FUNCTION update_net_work_minutes();
```

### 7.5 Views Útiles

```sql
-- Vista de sesiones con totales calculados
CREATE VIEW v_sessions_summary AS
SELECT 
  ws.id,
  ws.user_id,
  ws.start_time,
  ws.end_time,
  ws.total_break_minutes,
  ws.net_work_minutes,
  ws.notes,
  p.name as project_name,
  p.color as project_color,
  COUNT(b.id) as break_count
FROM work_sessions ws
LEFT JOIN projects p ON ws.project_id = p.id
LEFT JOIN breaks b ON b.work_session_id = ws.id
GROUP BY ws.id, p.name, p.color;

-- Vista de estadísticas semanales
CREATE VIEW v_weekly_stats AS
SELECT 
  user_id,
  DATE_TRUNC('week', start_time) as week_start,
  COUNT(*) as days_worked,
  SUM(net_work_minutes) as total_minutes,
  AVG(net_work_minutes) as avg_minutes_per_day
FROM work_sessions
WHERE end_time IS NOT NULL
GROUP BY user_id, DATE_TRUNC('week', start_time);
```

---

## 8. Especificaciones de UI/UX

### 8.1 Sistema de Diseño

#### Paleta de Colores (Light Mode)
```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    700: '#374151',
    900: '#111827',
  }
}
```

#### Paleta de Colores (Dark Mode)
```javascript
colors: {
  primary: {
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
  },
  background: {
    DEFAULT: '#0f172a',
    paper: '#1e293b',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
  }
}
```

#### Tipografía
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}

fontSize: {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
}
```

#### Espaciado
```javascript
spacing: {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
}
```

#### Bordes y Sombras
```javascript
borderRadius: {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
}

boxShadow: {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
}
```

### 8.2 Componentes UI Principales

#### TimeTracker Component
- Timer grande y visible
- Botones de acción prominentes (Start/Stop)
- Indicador visual de estado
- Contador de tiempo en vivo
- Animaciones suaves de transición

#### Session Card
- Información compacta y escaneable
- Badges para pausas y proyectos
- Acciones rápidas (editar, eliminar)
- Hover states con información adicional

#### Charts
- Gráficos responsivos
- Tooltips informativos
- Animaciones de entrada
- Colores consistentes con el tema
- Leyendas claras

#### Calendar
- Vista mensual completa
- Indicadores de estado por día
- Modal con detalles al hacer click
- Navegación intuitiva
- Resaltado del día actual

### 8.3 Animaciones (Framer Motion)

```typescript
// Fade in
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

// Scale up
const scaleUp = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
}

// Slide in
const slideIn = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 100 }
}
```

### 8.4 Responsive Breakpoints
```javascript
screens: {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}
```

### 8.5 Accesibilidad
- Focus indicators visibles
- Labels en todos los inputs
- ARIA labels apropiados
- Navegación por teclado completa
- Contraste WCAG AA mínimo
- Textos alternativos en imágenes

---

## 9. Seguridad y Autenticación

### 9.1 Flujo de Autenticación

```
1. Usuario ingresa credenciales
2. Next.js envía request a Supabase Auth
3. Supabase valida y retorna JWT
4. Token se almacena en httpOnly cookie
5. Middleware valida token en cada request
6. Si token es válido, permite acceso
7. Si token expira, refresh automático
```

### 9.2 Protección de Rutas

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient({ req: request, res: response });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return response;
}
```

### 9.3 Validación de Datos

```typescript
// Ejemplo con Zod
const sessionSchema = z.object({
  startTime: z.date(),
  endTime: z.date().optional(),
  notes: z.string().max(500).optional(),
  projectId: z.string().uuid().optional(),
});
```

### 9.4 Rate Limiting
- Máximo 100 requests por minuto por usuario
- Máximo 5 intentos de login por 15 minutos
- Throttling en operaciones de escritura

### 9.5 Encriptación
- HTTPS en todas las comunicaciones
- Passwords hasheados con bcrypt
- Tokens JWT firmados
- Datos sensibles encriptados en DB

---

## 10. Casos de Uso

### CU-001: Registrar Inicio de Jornada

**Actor:** Usuario autenticado

**Precondiciones:**
- Usuario ha iniciado sesión
- No existe una jornada activa

**Flujo Principal:**
1. Usuario accede al dashboard
2. Sistema muestra botón "Iniciar Jornada"
3. Usuario hace click en el botón
4. Sistema registra timestamp actual
5. Sistema crea registro en `work_sessions`
6. Sistema muestra timer en vivo
7. Sistema muestra notificación de éxito

**Flujo Alternativo:**
- Si ya existe jornada activa, mostrar error
- Si falla conexión, almacenar localmente y sincronizar después

---

### CU-002: Tomar Pausa

**Actor:** Usuario autenticado

**Precondiciones:**
- Existe una jornada activa
- No hay pausa activa

**Flujo Principal:**
1. Usuario hace click en "Tomar Pausa"
2. Sistema muestra opciones de tipo de pausa
3. Usuario selecciona tipo (almuerzo/corto/personal)
4. Sistema registra inicio de pausa
5. Sistema pausa el timer de trabajo
6. Sistema inicia timer de pausa
7. Usuario hace click en "Terminar Pausa"
8. Sistema registra fin de pausa
9. Sistema calcula duración
10. Sistema reanuda timer de trabajo

---

### CU-003: Generar Reporte Mensual

**Actor:** Usuario autenticado

**Precondiciones:**
- Usuario tiene jornadas registradas

**Flujo Principal:**
1. Usuario accede a sección de Reportes
2. Usuario selecciona rango de fechas (mes actual)
3. Usuario hace click en "Generar Reporte"
4. Sistema consulta todas las jornadas del período
5. Sistema calcula estadísticas
6. Sistema genera gráficos
7. Sistema muestra preview del reporte
8. Usuario selecciona "Exportar a PDF"
9. Sistema genera PDF
10. Sistema descarga archivo

---

## 11. Cronograma de Desarrollo

### Fase 1: Configuración y Base (Semana 1-2)
- ✓ Configuración del proyecto Next.js
- ✓ Setup de Tailwind CSS y tema
- ✓ Configuración de Supabase
- ✓ Creación de esquema de base de datos
- ✓ Sistema de autenticación
- ✓ Estructura de componentes base

### Fase 2: Funcionalidad Core (Semana 3-4)
- ✓ Registro de entradas/salidas
- ✓ Sistema de pausas
- ✓ Timer en tiempo real
- ✓ Cálculos automáticos
- ✓ Dashboard principal

### Fase 3: Visualización y Reportes (Semana 5-6)
- ✓ Historial de jornadas
- ✓ Calendario de asistencia
- ✓ Gráficos y estadísticas
- ✓ Generación de reportes
- ✓ Exportación a PDF/CSV

### Fase 4: Features Avanzadas (Semana 7-8)
- ✓ Sistema de proyectos
- ✓ Notificaciones
- ✓ Modo offline
- ✓ Optimización de rendimiento
- ✓ PWA configuration

### Fase 5: Testing y Refinamiento (Semana 9-10)
- ✓ Tests unitarios
- ✓ Tests de integración
- ✓ Tests E2E
- ✓ Corrección de bugs
- ✓ Optimización final

### Fase 6: Deployment y Monitoreo (Semana 11-12)
- ✓ Deploy a producción
- ✓ Configuración de monitoreo
- ✓ Documentación de usuario
- ✓ Training y handoff

---

## 12. Glosario

**Jornada Laboral:** Período de tiempo desde que un usuario inicia trabajo hasta que lo finaliza.

**Pausa:** Intervalo de tiempo dentro de una jornada donde el usuario no está trabajando activamente.

**Tiempo Neto:** Total de horas trabajadas menos el tiempo de pausas.

**Horas Extras:** Tiempo trabajado que excede la jornada laboral esperada configurada por el usuario.

**Sesión de Trabajo:** Sinónimo de jornada laboral, registro individual de entrada y salida.

**Timer:** Contador visual que muestra el tiempo transcurrido en tiempo real.

**Dashboard:** Panel principal de la aplicación donde se muestran métricas y accesos rápidos.

**RLS (Row Level Security):** Sistema de seguridad de Supabase que restringe acceso a datos a nivel de fila.

**SSR (Server-Side Rendering):** Renderizado en el servidor para mejor performance y SEO.

**PWA (Progressive Web App):** Aplicación web que puede instalarse y funcionar offline.

**JWT (JSON Web Token):** Token de autenticación encriptado.

**Responsive Design:** Diseño que se adapta a diferentes tamaños de pantalla.

---

## Apéndices

### A. Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXX
```

### B. Scripts de Package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:e2e": "playwright test",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop"
  }
}
```

### C. Comandos Útiles de Supabase

```bash
# Inicializar proyecto local
supabase init

# Generar tipos TypeScript
supabase gen types typescript --local > src/types/database.ts

# Crear migración
supabase migration new migration_name

# Aplicar migraciones
supabase db push

# Reset database
supabase db reset
```

### D. Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Tests pasando
- [ ] Type checking sin errores
- [ ] Linting sin warnings
- [ ] Performance optimizada (Lighthouse > 90)
- [ ] Accesibilidad validada
- [ ] SEO configurado
- [ ] Error handling completo
- [ ] Logs configurados
- [ ] Backup strategy definida
- [ ] Monitoring activado
- [ ] Rate limiting configurado
- [ ] CORS configurado correctamente
- [ ] SSL/HTTPS habilitado

---

## Conclusión

Este documento especifica los requerimientos completos para el desarrollo de TimeTrack Pro, una aplicación moderna de control horario. La implementación seguirá las mejores prácticas de desarrollo web, priorizando experiencia de usuario, rendimiento, seguridad y mantenibilidad.

El sistema está diseñado para ser escalable, extensible y fácil de mantener, utilizando tecnologías modernas y probadas en la industria.

---

**Documento preparado por:** Claude AI  
**Fecha de última actualización:** 11 de Febrero, 2026  
**Versión:** 1.0  
**Estado:** Aprobado para Desarrollo