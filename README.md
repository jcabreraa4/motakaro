# Motakaro

> Open-source B2B SaaS infrastructure built for online agencies. Reusable monorepo with a public landing, a client portal, and an admin dashboard — all sharing UI components and config.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo)](https://turbo.build)
[![Bun](https://img.shields.io/badge/Bun-package%20manager-F9F1E1?logo=bun)](https://bun.sh)

---

## About the Project

This monorepo powers [Motakaro](https://motakaro.com) — a GTM Agency serving B2B tech companies. The infrastructure is open-sourced so other agencies or SaaS teams can reuse and adapt it.

It ships three connected apps:

| App | Domain | Description |
|-----|--------|-------------|
| `web` | `motakaro.com` | Landing page |
| `clients` | `clients.motakaro.com` | Clients portal |
| `admins` | `admins.motakaro.com` | Admins dashboard |

All apps share UI components, TypeScript config, ESLint rules, Convex config and Tailwind tokens via the `packages/` layer.

---

## Tech Stack

### Core Technologies
| Layer | Technology |
|-------|-----------|
| Framework | Nextjs |
| Monorepo | Turborepo |
| Package Manager | Bun |
| Language | TypeScript |
| Formatting | Prettier |

### Frontend Base
| Layer | Technology |
|-------|-----------|
| UI Components | Shadcn/ui |
| Styling | Tailwind CSS |
| State | Zustand |
| URL State | Nuqs |
| Rich Text | TipTap Editor |

### Backend & Auth
| Layer | Technology |
|-------|-----------|
| Backend / DB | Convex |
| Auth + Billing | Clerk |
| Error Tracking | Sentry |
| AI Functions | AI SDK |

### Infrastructure
| Layer | Technology |
|-------|-----------|
| Landing Deploy | Vercel |
| Clients Portal | Railway |
| Admins Dashboard | Railway |
| Storage | Convex |

---

## Repository Structure

```
motakaro/
├── apps/
│   ├── landing/            # Landing page
│   ├── clients/            # Clients portal
│   └── admins/             # Admins dashboard
├── packages/
│   ├── ui/                 # Shared Shadcn/ui components
│   ├── backend/            # Shared Convex configuration
│   ├── typescript-config/  # Shared TypeScript config
│   └── eslint-config/      # Shared ESLint rules
├── turbo.json
├── package.json
└── bun.lockb
```

---

## Contributing

This is an open-source infrastructure project. PRs, issues, and suggestions are welcome.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using conventional commits: `feat:`, `fix:`, `chore:`
4. Open a PR

---

## License

MIT © 2026 Jorge Cabrera — see [LICENSE](LICENSE) for details. Feel free to use this as the base for your agency or SaaS.

---

<p align="center">
  Built by <a href="https://motakaro.com">Motakaro</a>
</p>
