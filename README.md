# Motakaro

Monorepo con Next.js, shadcn/ui y Turborepo.

## Stack

- **Framework**: Next.js 16
- **UI**: shadcn/ui + Base UI
- **Styles**: Tailwind CSS v4
- **Monorepo**: Turborepo
- **Package Manager**: Bun

## Estructura
```
apps/
└── web/          # App principal Next.js
packages/
└── ui/           # Componentes shadcn/ui compartidos
```

## Instalación
```bash
bun install
```

## Desarrollo
```bash
bun dev
```

## Añadir componentes

Desde `apps/web`:
```bash
cd apps/web
bunx --bun shadcn@latest add [componente]
```

Los componentes UI se instalan automáticamente en `packages/ui/src/components/`.

## Usar componentes
```tsx
import { Button } from "@workspace/ui/components/button"
```
