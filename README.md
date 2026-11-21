<h1 align="left">
  <img src="apps/landing/public/logo.webp" alt="Motakaro logo" width="60" align="absmiddle"> Motakaro
</h1>

> Business Infrastructure

[![License](https://img.shields.io/badge/License-MIT-3178C6.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Language-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Bun](https://img.shields.io/badge/Bun-Runtime-EFEFEF?logo=bun&logoColor=white)](https://bun.sh)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EFEFEF?logo=turborepo&logoColor=white)](https://turbo.build)
[![Nextjs](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Convex](https://img.shields.io/badge/Convex-Backend-EF4444?logo=convex&logoColor=white)](https://convex.dev)
[![Eve](https://img.shields.io/badge/Eve-Agents-000000)](https://eve.dev)
[![Trigger](https://img.shields.io/badge/Trigger.dev-BG%20Jobs-EF4444)](https://trigger.dev)

---

## About

Motakaro turns market research into content and sales: it detects buying signals, produces C-level content for LinkedIn, runs ads and closes deals on top of them. Open-source (MIT), early stage, built as a Bun + Turborepo monorepo with apps for the public landing, the clients area and the admins area, plus dedicated AI agent instances.

## Features

- Landing with Cal.com embed for scheduling, at `motakaro.com`.
- Clients app (`app.motakaro.com`) and admins app (`admins.motakaro.com`), desktop-ready via Tauri wrappers.
- AI agents built with Eve (`eve-admins` and `eve-clients` instances) fed by Convex data.
- Background jobs with Trigger.dev, email with Resend, file storage in R2.

## Stack

- **Next.js** — Full-stack React framework for every app, with typed routes and server components.
- **Convex** — Reactive backend and the single source of truth: database, identity, orgs and billing.
- **Clerk** — Authentication and user management.
- **Eve** — Vercel's AI agent framework, powering the dedicated agent apps.
- **Trigger.dev** — Long-running background jobs.
- **Tailwind CSS 4 + Shadcn** — Utility-first styling with composable components.
- **Bun + Turborepo** — Fast runtime and monorepo orchestration with version catalogs.

## Getting Started

```bash
bun install        # install dependencies
bun dev            # run all apps in dev mode via Turborepo
```

Requires Bun 1.4.4 and Node 24.x.

---

## License

MIT © 2026 Jorge Cabrera — see [LICENSE](LICENSE) for details. Feel free to use this as the base for your project.

---

<p align="center">
  Built by <a href="https://cabrerajorge.com">Jorge Cabrera</a>
</p>
