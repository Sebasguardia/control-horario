# Estándares de Base de Datos RPSoft

Este documento detalla los estándares técnicos para el manejo de persistencia de datos en el proyecto Control Horario (TimeTrack Pro).

> Para la referencia completa del estándar Supabase, ver `.agent/skills/rpsoft-supabase/skill.md`.

## 1. Estructura de Tablas

### Nomenclatura
- **Tablas**: Plural, snake_case (ej: `work_sessions`, `breaks`, `user_preferences`).
- **Columnas**: snake_case (ej: `total_break_minutes`, `start_time`, `break_type`).
- **Claves Foráneas**: `{tabla_singular}_id` (ej: `user_id`, `work_session_id`).
- **Índices**: `idx_{tabla}_{columna}` (ej: `idx_work_sessions_user_id`).

### Tipos de Datos
- **IDs**: `UUID` con `DEFAULT gen_random_uuid()`.
- **Timestamps**: `TIMESTAMPTZ` para asegurar consistencia con zonas horarias.
- **Boleanos**: Prefijo `is_` o `has_` (ej: `is_active`).
- **Enums**: `TEXT` con `CHECK` constraint (ej: `status IN ('active', 'completed', 'paused', 'break')`).

### Campos Obligatorios
Toda tabla principal debe contener:

| Campo | Tipo | Default | Requerido |
|-------|------|---------|-----------|
| `id` | UUID | `gen_random_uuid()` | PK |
| `user_id` | UUID | — | FK a `auth.users` |
| `created_at` | TIMESTAMPTZ | `NOW()` | NOT NULL |
| `updated_at` | TIMESTAMPTZ | `NOW()` | NOT NULL |

## 2. Esquema Actual

### Tablas del Sistema

| Tabla | Descripción | Campos Clave |
|-------|-------------|-------------|
| `profiles` | Perfil de usuario (extiende `auth.users`) | `full_name`, `schedule_start`, `schedule_end` |
| `projects` | Proyectos del usuario | `name`, `color`, `is_active` |
| `work_sessions` | Jornadas de trabajo | `start_time`, `end_time`, `status`, `net_work_minutes` |
| `breaks` | Pausas dentro de jornadas | `break_type`, `duration_minutes` |
| `user_preferences` | Configuración personalizada | `theme`, `notifications_enabled` |

### Relaciones
```
auth.users ──1:1──> profiles
auth.users ──1:N──> projects
auth.users ──1:N──> work_sessions
auth.users ──1:1──> user_preferences
work_sessions ──1:N──> breaks
projects ──1:N──> work_sessions (opcional)
```

## 3. Seguridad (RLS)

El 100% de las tablas que contienen datos de usuario tienen Row Level Security habilitado.

### Política Estándar (por operación)
```sql
ALTER TABLE public.work_sessions ENABLE ROW LEVEL SECURITY;

-- SELECT
CREATE POLICY "Users can view own sessions"
    ON public.work_sessions FOR SELECT
    USING (auth.uid() = user_id);

-- INSERT
CREATE POLICY "Users can create own sessions"
    ON public.work_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- UPDATE (doble check)
CREATE POLICY "Users can update own sessions"
    ON public.work_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE
CREATE POLICY "Users can delete own sessions"
    ON public.work_sessions FOR DELETE
    USING (auth.uid() = user_id);
```

### Política para Tablas Hijas (ej: `breaks`)
Las tablas sin `user_id` directo derivan propiedad mediante `EXISTS`:
```sql
CREATE POLICY "Users can view own breaks"
    ON public.breaks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.work_sessions ws
            WHERE ws.id = work_session_id AND ws.user_id = auth.uid()
        )
    );
```

## 4. Triggers Automáticos

| Trigger | Tabla | Función | Propósito |
|---------|-------|---------|-----------|
| `on_profiles_updated` | profiles | `handle_updated_at()` | Auto-update `updated_at` |
| `on_projects_updated` | projects | `handle_updated_at()` | Auto-update `updated_at` |
| `on_work_sessions_updated` | work_sessions | `handle_updated_at()` | Auto-update `updated_at` |
| `on_user_preferences_updated` | user_preferences | `handle_updated_at()` | Auto-update `updated_at` |
| `on_auth_user_created` | auth.users | `handle_new_user()` | Auto-create profile + preferences |
| `on_break_end` | breaks | `handle_break_end()` | Calcula `duration_minutes` |
| `on_break_completed` | breaks | `handle_break_completed()` | Actualiza `total_break_minutes` en session |
| `on_session_end` | work_sessions | `handle_session_end()` | Calcula `net_work_minutes` y marca completed |

## 5. Manejo de Fechas
- Las timestamps se almacenan como `TIMESTAMPTZ` (siempre con zona horaria).
- Los registros de auditoría (`created_at`, `updated_at`) usan `DEFAULT NOW()`.
- La zona horaria del usuario se almacena en `profiles.timezone`.

## 6. Integración en Código
- Usar `createBrowserClient<Database>()` de `@supabase/ssr` para Next.js.
- Definir tipos de TypeScript en `src/types/database.ts` que reflejen exactamente el esquema.
- Modelos de dominio en `src/types/models.ts`.
- Manejar errores de Supabase de forma centralizada en los servicios (`src/services/`).
- Nunca usar `as any` para bypasear tipos de Supabase.

## 7. Checklist de Seguridad

- [x] RLS habilitado en TODAS las tablas (profiles, projects, work_sessions, breaks, user_preferences).
- [x] Políticas per-operation (SELECT, INSERT, UPDATE, DELETE separadas).
- [x] Variables de entorno para credenciales (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- [x] `SERVICE_ROLE_KEY` nunca expuesta en frontend.
- [x] Triggers de `updated_at` en todas las tablas relevantes.
- [x] Auto-creación de profile y preferences en signup.
