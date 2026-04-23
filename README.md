# Motakaro

> Open-source B2B SaaS infrastructure built for LinkedIn Ads agencies. Reusable monorepo with a public landing, a client portal, and an admin dashboard — all sharing UI components and config.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo)](https://turbo.build)
[![Bun](https://img.shields.io/badge/Bun-package%20manager-F9F1E1?logo=bun)](https://bun.sh)

---

## What is this?

This monorepo powers [Motakaro](https://motakaro.com) — a LinkedIn Ads agency serving B2B tech companies. The infrastructure is open-sourced so other agencies or SaaS teams can reuse and adapt it.

It ships three apps out of the box:

| App | Domain | Description |
|-----|--------|-------------|
| `web` | `motakaro.com` | Public landing page |
| `clients` | `clients.motakaro.com` | Client-facing portal |
| `admins` | `admins.motakaro.com` | Internal admin dashboard |

All apps share UI components, TypeScript config, ESLint rules, and Tailwind tokens via the `packages/` layer.

---

## Stack

### Core
| Layer | Technology |
|-------|-----------|
| Framework | Next.js (Turbopack) |
| Monorepo | Turborepo |
| Package Manager | Bun |
| Language | TypeScript |

### Frontend
| Layer | Technology |
|-------|-----------|
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Rich Text | TipTap Editor |
| URL State | nuqs |
| Formatting | Prettier |

### Backend & Auth
| Layer | Technology |
|-------|-----------|
| Backend / DB | Convex |
| Auth + Billing | Clerk |
| Background Jobs | Inngest |
| API Layer | Hono + Bun |
| Error Tracking | Sentry |

### AI
| Layer | Technology |
|-------|-----------|
| AI SDK | Vercel AI SDK v6 |
| Models | Mistral AI |
| Local inference | Ollama |
| Voice | VAPI |

### Infrastructure
| Layer | Technology |
|-------|-----------|
| Frontend Deploy | Vercel |
| Self-hosted tools | Railway |
| Storage | Convex Storage + UploadThing |
| Containerization | Docker |

### Self-hosted tools (Railway)
- **N8N** — automations (+ worker, Postgres, Redis)
- **Twenty CRM** — CRM
- **DocuSeal** — contract signing (persistent S3-compatible storage via Railway Bucket)

---

## Repository structure

```
motakaro/
├── apps/
│   ├── web/               # Public landing page (motakaro.com)
│   ├── clients/           # Client portal (clients.motakaro.com)
│   └── admins/            # Admin dashboard (admins.motakaro.com)
├── packages/
│   ├── ui/                # Shared shadcn/ui components (@workspace/ui)
│   ├── typescript-config/ # Shared tsconfig base
│   └── eslint-config/     # Shared ESLint rules
├── turbo.json
├── package.json
└── bun.lockb
```

### Dev ports

| App | Port |
|-----|------|
| `web` | 3000 |
| `clients` | 3001 |
| `admins` | 3002 |

---

## Getting started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Node.js](https://nodejs.org) >= 20 (required by some tooling)
- A [Clerk](https://clerk.com) account (auth + billing)
- A [Convex](https://convex.dev) project

### 1. Clone and install

```bash
git clone https://github.com/your-org/motakaro.git
cd motakaro
bun install
```

### 2. Set up environment variables

Each app has its own `.env.local`. Copy the examples:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/clients/.env.example apps/clients/.env.local
cp apps/admins/.env.example apps/admins/.env.local
```

Minimum required variables per app:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=

# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOY_KEY=

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=
```

### 3. Start development

```bash
# All apps in parallel
bun dev

# Single app
bun dev --filter=clients
bun dev --filter=admins
bun dev --filter=web
```

---

## UI components

Shared components live in `packages/ui` and are installed via shadcn into that package automatically.

### Adding a component

From the root or from any app:

```bash
cd apps/clients
bunx --bun shadcn@latest add button
```

Components are installed in `packages/ui/src/components/` and available across all apps.

### Importing components

```tsx
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
```

---

## Turborepo tasks

```bash
bun dev          # Run all apps in dev mode
bun build        # Build all apps
bun lint         # Lint all packages
bun typecheck    # Type-check all packages
bun format       # Format with Prettier
```

Turborepo caches build outputs — subsequent builds are significantly faster.

---

## Clerk setup

This project uses Clerk for authentication and billing across the `clients` and `admins` apps.

### Billing tiers

| Plan | Key |
|------|-----|
| Trial | `trial` |
| Rollout | `rollout` |
| Scaling | `scaling` |

Billing events are synced to Convex via Clerk webhooks (`subscriptionItem.active` and related events). Configure your webhook endpoint in the Clerk dashboard pointing to your Convex HTTP action.

### Dark mode

Clerk modals require this CSS fix to render correctly with Tailwind dark mode:

```css
html.dark {
  color-scheme: dark;
}
```

---

## Convex setup

```bash
# Install Convex CLI
bunx convex dev

# Deploy to production
bunx convex deploy
```

Convex handles the database, real-time subscriptions, file storage, background mutations, and vector search. No separate database setup is needed.

---

## Deployment

### Frontend — Vercel (recommended)

Vercel has native Turborepo and Convex support. Set the following per project in Vercel:

- **Root directory**: `apps/web` (or `apps/clients`, `apps/admins`)
- **Build command**: `cd ../.. && bun run build --filter=web`
- **Install command**: `bun install`

### Self-hosted tools — Railway

The self-hosted stack (N8N, Twenty CRM, DocuSeal) runs on Railway. Each tool is a separate Railway service. DocuSeal uses Railway's native S3-compatible bucket for persistent storage.

Refer to each tool's Railway deployment guide for service-specific environment variables.

---

## Contributing

This is an open-source infrastructure project. PRs, issues, and suggestions are welcome.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using conventional commits: `feat:`, `fix:`, `chore:`
4. Open a PR

---

## License

MIT © 2026 Jorge Cabrera — see [LICENSE](LICENSE) for details. Feel free to use this as the base for your own agency or SaaS.

---

<p align="center">
  Built by <a href="https://motakaro.com">Motakaro</a>
</p>
