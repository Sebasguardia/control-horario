---
name: rpsoft-supabase
description: Estándar de ingeniería de datos con Supabase para proyectos RPSoft.
---

# Estándar Supabase RPSoft

Este documento define las mejores prácticas para el diseño de bases de datos y la integración con Supabase en RPSoft.

## Convenciones de Base de Datos

### Nomenclatura
| Objeto | Formato | Ejemplo |
|--------|---------|---------|
| Tablas | snake_case, plural | `work_sessions`, `user_preferences` |
| Columnas | snake_case | `start_time`, `break_type` |
| Claves primarias | `id` | UUID con `gen_random_uuid()` |
| Claves foráneas | `{tabla_singular}_id` | `user_id`, `work_session_id` |
| Índices | `idx_{tabla}_{columna}` | `idx_work_sessions_user_id` |
| Políticas RLS | Texto descriptivo en inglés | `"Users can view own sessions"` |
| Triggers | `on_{tabla}_{evento}` | `on_profiles_updated` |
| Funciones | `handle_{acción}` | `handle_updated_at()` |

### Tipos de Datos
- **IDs**: `UUID` con `DEFAULT gen_random_uuid()`.
- **Timestamps**: `TIMESTAMPTZ` (siempre con zona horaria) con `DEFAULT NOW()`.
- **Boleanos**: Prefijo `is_` o `has_` (ej: `is_active`, `has_breaks`).
- **Enums de texto**: Usar `CHECK` constraint (ej: `CHECK (status IN ('active', 'completed'))`).

## Campos Obligatorios

Toda tabla principal **DEBE** contener:

| Campo | Tipo | Default | Nota |
|-------|------|---------|------|
| `id` | `UUID` | `gen_random_uuid()` | Primary Key |
| `user_id` | `UUID` | — | FK a `auth.users(id) ON DELETE CASCADE` |
| `created_at` | `TIMESTAMPTZ` | `NOW()` | NOT NULL |
| `updated_at` | `TIMESTAMPTZ` | `NOW()` | NOT NULL, auto-actualizado por trigger |

**Excepción**: Tablas hijas (como `breaks`) pueden referenciar a su tabla padre en vez de `user_id`, derivando la propiedad via RLS con `EXISTS`.

## Triggers Automáticos

### Auto-update `updated_at`
Toda tabla con `updated_at` debe tener este trigger:

```sql
CREATE TRIGGER on_{tabla}_updated
    BEFORE UPDATE ON public.{tabla}
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

La función compartida:
```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Auto-create profile en signup
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id, NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 
            'https://api.dicebear.com/7.x/initials/svg?seed=' || 
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
    );
    INSERT INTO public.user_preferences (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Políticas de RLS (Row Level Security)

### Regla de Oro
**RLS habilitado en TODAS las tablas. Sin excepciones.**

### Política Base (tablas con `user_id`)
Crear una política **por operación** (no usar `FOR ALL`):

```sql
ALTER TABLE public.{tabla} ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own {tabla}"
    ON public.{tabla} FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own {tabla}"
    ON public.{tabla} FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own {tabla}"
    ON public.{tabla} FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own {tabla}"
    ON public.{tabla} FOR DELETE
    USING (auth.uid() = user_id);
```

### Política para Tablas Hijas (sin `user_id` directo)
Derivar propiedad mediante `EXISTS`:

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

### Política para `profiles` (PK = user id)
```sql
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);
```

## Índices Recomendados

- **FK columns**: Siempre indexar columnas de FK (`user_id`, `work_session_id`).
- **Consultas frecuentes**: Índices compuestos para filtros comunes.

```sql
-- Ejemplo índices para work_sessions
CREATE INDEX idx_work_sessions_user_id ON public.work_sessions(user_id);
CREATE INDEX idx_work_sessions_user_date ON public.work_sessions(user_id, start_time DESC);
CREATE INDEX idx_work_sessions_status ON public.work_sessions(user_id, status);
```

## Checklist de Seguridad

- [ ] RLS está habilitado para **TODAS** las tablas.
- [ ] Cada tabla tiene políticas per-operation (SELECT, INSERT, UPDATE, DELETE separadas).
- [ ] No se exponen claves privadas (`SERVICE_ROLE_KEY`) en el frontend.
- [ ] `SUPABASE_URL` y `SUPABASE_ANON_KEY` se usan exclusivamente via `process.env.NEXT_PUBLIC_*`.
- [ ] La clave `SERVICE_ROLE_KEY` **nunca** aparece en código del lado cliente.
- [ ] Validaciones de tipos en TypeScript reflejan exactamente el esquema de la DB (`types/database.ts`).
- [ ] Las funciones de DB usan `SECURITY DEFINER` para operar con privilegios elevados de forma controlada.
- [ ] Los triggers de `updated_at` están configurados en todas las tablas que lo requieren.

## Ejemplo Completo de Esquema (Tabla `work_sessions`)

```sql
-- Crear tabla
CREATE TABLE public.work_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    total_break_minutes INTEGER DEFAULT 0,
    net_work_minutes INTEGER,
    notes TEXT,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'break')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices
CREATE INDEX idx_work_sessions_user_id ON public.work_sessions(user_id);
CREATE INDEX idx_work_sessions_user_date ON public.work_sessions(user_id, start_time DESC);
CREATE INDEX idx_work_sessions_status ON public.work_sessions(user_id, status);

-- RLS
ALTER TABLE public.work_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
    ON public.work_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
    ON public.work_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
    ON public.work_sessions FOR UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
    ON public.work_sessions FOR DELETE USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER on_work_sessions_updated
    BEFORE UPDATE ON public.work_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## Integración en Código TypeScript

### Cliente Supabase
- Usar `createBrowserClient<Database>()` de `@supabase/ssr` en el cliente.
- Usar `createServerClient<Database>()` en server components y middleware.
- Usar un singleton (`getSupabaseClient()`) para evitar múltiples instancias.

### Tipado
- Definir tipos en `src/types/database.ts` con `Row`, `Insert`, `Update` por tabla.
- Usar helpers: `Tables<'work_sessions'>`, `InsertDto<'work_sessions'>`.
- Los modelos de dominio en `src/types/models.ts` deben coincidir exactamente con el schema.

### Manejo de Errores
```typescript
const { data, error } = await supabase.from('work_sessions').select('*');
if (error) {
    console.error('Error fetching sessions:', error);
    return []; // o null, según el contrato del servicio
}
return data;
```
