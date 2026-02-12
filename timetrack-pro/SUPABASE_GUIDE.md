# Guía de Uso de Supabase en TimeTrack Pro

## Configuración Completada ✅

La base de datos de Supabase ha sido completamente configurada con:

- **5 Tablas**: users, work_sessions, breaks, projects, user_preferences
- **Políticas RLS**: Seguridad a nivel de fila para todos los datos
- **6 Funciones**: Automatización de cálculos y triggers
- **5 Vistas**: Para reportes y análisis

## Conexión a Supabase

### Cliente (Browser)

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Ejemplo: Obtener sesiones del usuario actual
const { data: sessions, error } = await supabase
  .from('work_sessions')
  .select('*')
  .order('start_time', { ascending: false })
```

### Servidor (Server Components / Server Actions)

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()

// Ejemplo: Obtener usuario actual
const { data: { user } } = await supabase.auth.getUser()
```

## Ejemplos de Uso

### 1. Iniciar Sesión de Trabajo

```typescript
const { data, error } = await supabase
  .from('work_sessions')
  .insert({
    user_id: user.id,
    start_time: new Date().toISOString(),
  })
  .select()
  .single()
```

### 2. Finalizar Sesión de Trabajo

```typescript
const { data, error } = await supabase
  .from('work_sessions')
  .update({
    end_time: new Date().toISOString(),
  })
  .eq('id', sessionId)
  .select()
  .single()

// El trigger calculará automáticamente net_work_minutes
```

### 3. Iniciar Pausa

```typescript
const { data, error } = await supabase
  .from('breaks')
  .insert({
    work_session_id: sessionId,
    break_type: 'lunch',
    start_time: new Date().toISOString(),
  })
  .select()
  .single()
```

### 4. Finalizar Pausa

```typescript
const { data, error } = await supabase
  .from('breaks')
  .update({
    end_time: new Date().toISOString(),
  })
  .eq('id', breakId)
  .select()
  .single()

// Los triggers actualizarán automáticamente:
// - duration_minutes en la pausa
// - total_break_minutes en la sesión
```

### 5. Obtener Estadísticas Semanales

```typescript
const { data, error } = await supabase
  .from('v_weekly_stats')
  .select('*')
  .eq('user_id', user.id)
  .order('week_start', { ascending: false })
  .limit(4)
```

### 6. Obtener Resumen de Sesiones

```typescript
const { data, error } = await supabase
  .from('v_sessions_summary')
  .select('*')
  .eq('user_id', user.id)
  .gte('session_date', startDate)
  .lte('session_date', endDate)
```

### 7. Crear Proyecto

```typescript
const { data, error } = await supabase
  .from('projects')
  .insert({
    user_id: user.id,
    name: 'Proyecto Cliente A',
    description: 'Desarrollo de aplicación web',
    color: '#3b82f6',
  })
  .select()
  .single()
```

### 8. Obtener Sesión Activa

```typescript
const { data, error } = await supabase
  .from('work_sessions')
  .select('*')
  .eq('user_id', user.id)
  .is('end_time', null)
  .single()
```

## Autenticación

### Registro de Usuario

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@example.com',
  password: 'contraseña-segura',
  options: {
    data: {
      full_name: 'Juan Pérez',
    }
  }
})

// El trigger handle_new_user creará automáticamente:
// - Registro en tabla users
// - Registro en tabla user_preferences
```

### Login

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@example.com',
  password: 'contraseña-segura',
})
```

### Logout

```typescript
const { error } = await supabase.auth.signOut()
```

### Obtener Usuario Actual

```typescript
const { data: { user } } = await supabase.auth.getUser()
```

## Seguridad (RLS)

Todas las tablas tienen políticas de Row Level Security (RLS) configuradas:

- ✅ Los usuarios solo pueden ver sus propios datos
- ✅ Los usuarios solo pueden modificar sus propios datos
- ✅ Las pausas están protegidas por la sesión a la que pertenecen
- ✅ Los proyectos son privados para cada usuario

## Funciones Automáticas

### Cálculos Automáticos

1. **duration_minutes** en breaks: Se calcula automáticamente al finalizar la pausa
2. **total_break_minutes** en work_sessions: Se actualiza automáticamente cuando cambian las pausas
3. **net_work_minutes** en work_sessions: Se calcula automáticamente al finalizar la sesión
4. **updated_at**: Se actualiza automáticamente en cada modificación

### Triggers

- `on_auth_user_created`: Crea perfil y preferencias al registrarse
- `calculate_duration_on_break_end`: Calcula duración de pausa
- `update_break_total_on_*`: Actualiza total de pausas en sesión
- `calculate_net_minutes_on_end`: Calcula minutos netos trabajados
- `set_updated_at_*`: Actualiza timestamp de modificación

## Próximos Pasos

1. ✅ Actualizar `session-service.ts` para usar Supabase
2. ✅ Actualizar `break-service.ts` para usar Supabase
3. ✅ Actualizar `report-service.ts` para usar Supabase
4. ✅ Implementar autenticación en páginas de login/register
5. ✅ Probar flujo completo de sesiones y pausas

## Variables de Entorno

Asegúrate de que `.env.local` contenga:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kmovzonhrxxthvwnaukk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
```

## Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
