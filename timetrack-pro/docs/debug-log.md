# Debug Log — Sprint 1

Registro de bugs detectados y corregidos durante la aplicación de estándares en Sprint 1.

---

## Bug 1: `Button.asChild` no renderiza `Slot`

**Archivo**: `src/components/ui/button.tsx`  
**Severidad**: Media  
**Detectado en**: Revisión de código durante estandarización UI

### Descripción
El componente `Button` acepta una prop `asChild` (de tipo `boolean`) y declara la importación de `Slot` desde `@radix-ui/react-slot`, pero la lógica interna siempre asignaba `const Comp = "button"`, ignorando completamente el valor de `asChild`.

Esto significa que aunque un consumidor pasara `asChild={true}`, el componente **siempre** renderizaba un `<button>` HTML en lugar de delegar el render al hijo (comportamiento esperado de `Slot`).

### Causa Raíz
La línea condicional `const Comp = asChild ? Slot : "button"` fue reemplazada por `const Comp = "button"` en algún punto, probablemente durante una refactorización.

### Solución
```diff
- const Comp = "button"
+ const Comp = asChild ? Slot : "button"
```

### Impacto
Cualquier uso de `<Button asChild>` (por ejemplo, wrapping de `<Link>` de Next.js con estilos de botón) no funcionaba correctamente. Ahora la delegación de rendering funciona como se espera.

---

## Bug 2: `schema_reference.sql` desactualizado

**Archivo**: `supabase/schema_reference.sql`  
**Severidad**: Baja (solo documentación)  
**Detectado en**: Comparación contra migración `001_initial_schema.sql`

### Descripción
El archivo de referencia de esquema contenía una versión antigua del schema:
- Tabla `sessions` en vez de `work_sessions`
- Columnas faltantes: `location_lat`, `location_lng`, `project_id`, `net_work_minutes`
- Columnas de `profiles` obsoletas (sin `email`, `gender`, `city`, `position`, `department`, `schedule_start`, `schedule_end`)
- Tabla `user_preferences` completamente ausente
- Sin referencia a RLS

### Causa Raíz
El archivo de referencia fue creado inicialmente como guía antes de la migración final, pero nunca fue actualizado tras crear `001_initial_schema.sql`.

### Solución
Se reescribió `schema_reference.sql` para reflejar exactamente las 5 tablas, sus columnas, constraints y RLS enablement de la migración real.

---

## Bug 3: `UserPreferences` model incompleto

**Archivo**: `src/types/models.ts`  
**Severidad**: Baja  
**Detectado en**: Comparación entre `models.ts` y `database.ts`

### Descripción
El interface `UserPreferences` en `models.ts` no incluía los campos `exit_reminder` (boolean) ni `work_days_per_week` (number), que sí existen tanto en la tabla de base de datos como en el tipo `database.ts`.

### Causa Raíz
Los campos fueron agregados a la DB y a `database.ts` pero no se propagaron al modelo de dominio.

### Solución
```diff
  overtime_alerts: boolean;
+ exit_reminder: boolean;
  language: string;
+ work_days_per_week: number;
  created_at: string;
```

### Impacto
Código que usara `UserPreferences` de `models.ts` no tendría acceso tipado a estos campos, requiriendo casts manuales.
