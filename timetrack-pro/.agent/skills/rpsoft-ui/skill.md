---
name: rpsoft-ui
description: Estándar de ingeniería UI para proyectos RPSoft.
---

# Estándar UI RPSoft

Este documento define las reglas y convenciones para el desarrollo de interfaces de usuario en RPSoft.

## Stack Oficial
- **Framework**: Next.js (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes Base**: Radix UI (vía shadcn/ui)
- **Íconos**: Lucide React
- **Animaciones**: Framer Motion

## Tokens de Diseño

### Colores (CSS Custom Properties)
Los colores se definen en `globals.css` usando HSL y se consumen mediante Tailwind:

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| `--primary` | `142.1 76.2% 36.3%` | `142.1 70.6% 45.3%` | Acciones principales, CTA |
| `--secondary` | `210 40% 96.1%` | `217.2 32.6% 17.5%` | Fondos de soporte |
| `--destructive` | `0 84.2% 60.2%` | `0 62.8% 30.6%` | Acciones peligrosas |
| `--accent` | `142.1 76.2% 96.3%` | `217.2 32.6% 17.5%` | Highlights sutiles |

### Colores de Surface
- **Sidebar / Header / Main**: `#F7F8F9` (light) / slate-900 (dark)
- **Brand verde**: `#166534` (dark green), `#1A5235` (botones CTA)
- **Cards**: `bg-white dark:bg-slate-900` con `border border-slate-50 dark:border-slate-800`

### Espaciado
- Usar **múltiplos de 4**: `p-4`, `m-2`, `gap-6`, `p-8`.
- Border radius estándar: `rounded-2xl` para cards, `rounded-full` para botones circulares.
- Radius global: `--radius: 1.5rem`.

## Reglas de Layout para Dashboard

Todos los dashboards deben seguir esta estructura obligatoria:

```
┌──────────┬─────────────────────────────────┐
│          │           Header/Navbar          │
│ Sidebar  ├─────────────────────────────────┤
│  (fija)  │                                 │
│          │        Área de Contenido         │
│          │     (scroll independiente)       │
│          │                                 │
└──────────┴─────────────────────────────────┘
```

1. **Sidebar (`<aside>`)**: Fija a la izquierda en desktop (`w-64`), drawer animado con overlay en mobile.
2. **Header/Navbar (`<header>`)**: Fija en la parte superior (`h-16 lg:h-20`), contiene búsqueda, theme toggle, notificaciones y perfil.
3. **Área de Contenido (`<main>`)**: Centrada con padding consistente (`p-5 sm:p-6 lg:p-8`), scroll independiente con `overflow-y-auto`.
4. **Contenedor raíz**: `flex h-screen` con gap entre paneles (`gap-2 lg:gap-3`).

### Scrollbar
- Sidebar: `no-scrollbar` (oculta pero funcional).
- Área de contenido: `custom-scrollbar` (estilizada).

## Convenciones de Nombres

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Componentes | PascalCase | `TimeTracker.tsx` |
| Archivos de página | `page.tsx` | `app/(dashboard)/dashboard/page.tsx` |
| Layouts | `layout.tsx` | `app/(dashboard)/layout.tsx` |
| Carpetas | kebab-case | `time-tracker/`, `quick-stats/` |
| Hooks | camelCase con prefijo `use` | `use-timer.ts` |
| Stores | kebab-case con sufijo `-store` | `session-store.ts` |
| Services | kebab-case con sufijo `-service` | `session-service.ts` |
| Variables CSS/Tailwind | kebab-case | `--primary-foreground` |

## Estilos Base

### Botones
Usar el componente `Button` de `@/components/ui/button` con variantes CVA:

| Variante | Uso | Ejemplo |
|----------|-----|---------|
| `default` | Acción principal | Guardar, Confirmar |
| `destructive` | Acción peligrosa | Eliminar |
| `outline` | Acción secundaria | Cancelar |
| `secondary` | Acción de soporte | Filtrar |
| `ghost` | Acción sutil | Íconos, menús |
| `link` | Navegación inline | Ver más |

Estados obligatorios en todo botón:
- `focus-visible:ring` (anillo de foco)
- `hover:` (cambio de opacidad o color)
- `disabled:opacity-50 disabled:pointer-events-none`
- `active:scale-95` (feedback táctil)

### Tipografía
- Títulos: `font-black tracking-tight`
- Labels de sección: `text-[11px] font-black uppercase tracking-[0.25em]`
- Cuerpo: `text-sm` o `text-base`, `font-bold`
- Números/Timer: `font-black tabular-nums tracking-tighter`

## Animaciones (Framer Motion)

### Transiciones de página
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
```

### Sidebar indicator
- Usar `layoutId` para transiciones fluidas entre ítems activos.
- `type: "spring", stiffness: 300, damping: 30`.

### Mobile sidebar
- Entrada: `x: "-100%"` → `x: 0` con spring.
- Overlay: `opacity: 0` → `opacity: 1` con fade.

## Responsive Design
- **Enfoque mobile-first**.
- Breakpoints estándar de Tailwind: `sm` (640), `md` (768), `lg` (1024), `xl` (1280).
- Sidebar: visible solo `lg:flex`, drawer en mobile.
- Ocultar elementos secundarios en mobile (info de perfil, shortcut de búsqueda).
- Botones: `w-full sm:w-auto` para acciones principales en mobile.

## Accesibilidad (A11y)

### Obligatorio
- **`aria-label`** en todo botón sin texto descriptivo (ej: botones con solo ícono).
- **`aria-current="page"`** en enlaces de navegación activos.
- **`aria-label`** en landmarks: `<nav aria-label="Menú principal">`, `<main aria-label="Contenido">`.
- **Contraste**: WCAG AA mínimo (4.5:1 para texto normal, 3:1 para texto grande).
- **Estructura semántica**: `<main>`, `<nav>`, `<header>`, `<aside>`, `<section>`.
- **Focus visible**: Todos los interactivos deben tener `focus-visible:ring`.

### Recomendado
- `role="status"` para elementos de estado en vivo (timer, contadores).
- `aria-live="polite"` para notificaciones que aparecen dinámicamente.

## Definition of Done (DoD) UI

Antes de considerar una feature de UI como completada:

- [ ] No hay errores ni warnings en la consola del navegador.
- [ ] La interfaz es totalmente funcional en mobile, tablet y desktop.
- [ ] El diseño es consistente con los otros módulos del sistema.
- [ ] Los estados de carga (skeletons) y error están implementados.
- [ ] Los interactivos tienen feedback visual (hover, active, focus).
- [ ] Los botones de solo ícono tienen `aria-label`.
- [ ] La estructura HTML usa etiquetas semánticas.
- [ ] Los colores respetan los tokens definidos en `globals.css`.
