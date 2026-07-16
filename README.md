# Motakaro

> Private open-source B2B SaaS infrastructure built for marketing agency.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo)](https://turbo.build)
[![Bun](https://img.shields.io/badge/Bun-package%20manager-F9F1E1?logo=bun)](https://bun.sh)

---

## About the Project

This monorepo powers [Motakaro](https://motakaro.com) — a GTM Agency serving B2B tech companies.

It ships three connected apps:

| App       | Domain                 | Description            |
| --------- | ---------------------- | ---------------------- |
| `landing` | `motakaro.com`         | Public Landing Page    |
| `clients` | `clients.motakaro.com` | Motakaro Clients App   |
| `admins`  | `admins.motakaro.com`  | Motakaro Employees App |

All apps share UI components, TypeScript config, ESLint rules, Convex functions and Trigger background jobs.

---

## Tech Stack

### Core Technologies

| Layer           | Technology |
| --------------- | ---------- |
| Repository      | Turborepo  |
| Language        | TypeScript |
| Package Manager | Bun        |
| Formatting      | Prettier   |
| Framework       | Nextjs 16  |

### Frontend

| Layer      | Technology    |
| ---------- | ------------- |
| Styling    | Tailwind CSS  |
| Components | Shadcn UI     |
| State      | Zustand       |
| URL State  | Nuqs          |
| Rich Text  | TipTap Editor |

### Backend

| Layer           | Technology |
| --------------- | ---------- |
| Auth & Billing  | Clerk      |
| DB & Backend    | Convex     |
| Background Jobs | Trigger    |
| Error Tracking  | Sentry     |
| AI Functions    | AI SDK     |

### Infrastructure

| Layer       | Technology |
| ----------- | ---------- |
| Landing App | Vercel     |
| Clients App | Vercel     |
| Admins App  | Vercel     |

---

## Repository Structure

```
motakaro/
├── apps/
│   ├── landing/            # Public landing page
│   ├── clients/            # Motakaro client access app
│   └── admins/             # Motakaro employee access app
├── packages/
│   ├── ui/                 # Shared Shadcn/ui components
│   ├── backend/            # Shared Convex functions
│   ├── trigger/            # Shared Trigger.dev jobs
│   ├── typescript-config/  # Shared TypeScript config
│   └── eslint-config/      # Shared ESLint rules
├── turbo.json
├── package.json
└── bun.lock
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
