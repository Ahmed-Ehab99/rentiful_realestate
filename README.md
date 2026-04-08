# Rentiful

**Rentiful** is a full-stack rental marketplace web application. It connects **tenants** looking for homes with **property managers** who list and oversee rental inventory. The product spans a public marketing and search experience, authenticated dashboards for both roles, rental applications, favorites, leases, and payment tracking—backed by PostgreSQL and modern file storage for listing photos.

---

## Table of contents

- [What this app does](#what-this-app-does)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture at a glance](#architecture-at-a-glance)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Authentication and roles](#authentication-and-roles)
- [Deployment notes](#deployment-notes)

---

## What this app does

Rentiful is built for two audiences:

| Audience | Purpose |
|----------|---------|
| **Tenants** | Discover rentals on a map and in list/grid views, save favorites, submit applications to properties they like, and manage their **residences** (leases, billing history, payments). |
| **Managers** | Publish and maintain **properties** (details, amenities, photos), review incoming **applications**, and configure account **settings**. |

The **public** area includes a landing page and a **search** experience with filters, map visualization, and property cards. **Sign-in** and **sign-up** use email/password and optional Google OAuth. Role-specific **dashboards** live under `/managers/*` and `/tenants/*` with a shared shell (sidebar, header).

---

## Features

### Public experience

- **Landing page** — Hero, feature highlights, discovery sections, and calls to action.
- **Search** — Filter rentals (location, price, bedrooms, amenities, etc.), toggle list/grid views, and browse results on an **interactive map** alongside listings.
- **Property discovery** — Rich property cards with imagery, pricing, and key facts.

### Tenant features

- **Favorites** — Save properties for quick access.
- **Applications** — Submit and track rental applications linked to listings.
- **Residences** — View current and past residences; drill into a residence for **lease** details, **billing history**, and **payment** information.
- **Settings** — Profile and account preferences.

### Manager features

- **Properties** — List all managed properties; create **new** listings with structured forms; open a property for full detail and management.
- **Applications** — Review tenant applications (with tabbed/filtered workflows where implemented).
- **Settings** — Manager profile and configuration.

### Platform and UX

- **Better Auth** — Sessions, email/password, Google sign-in, and username support.
- **Image uploads** — Presigned S3 flows for property and listing imagery.
- **Geocoding** — Server-side geocoding API for location-aware search.
- **Responsive UI** — Tailwind CSS, Radix-based components, sidebar navigation for dashboards, toast notifications (Sonner).
- **Data layer** — Prisma ORM with PostgreSQL (Neon-friendly adapter); typed queries and server actions for mutations.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js](https://nextjs.org) 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI | Radix UI, shadcn-style components, Lucide / Tabler icons |
| Auth | [Better Auth](https://www.better-auth.com) + Prisma adapter |
| Database | PostgreSQL via [Prisma](https://www.prisma.io) 7 (`@prisma/adapter-neon`) |
| Storage | AWS S3–compatible APIs (`@aws-sdk/client-s3`, presigned uploads) |
| Forms & validation | React Hook Form, Zod |
| Maps | MapLibre GL / Mapbox GL |
| Charts | Recharts (where used in dashboard) |
| State | Redux Toolkit (where used) |
| Env validation | `@t3-oss/env-nextjs` |

---

## Architecture at a glance

```text
app/
├── (main)/          # Public site: home, search, property detail
├── (auth)/          # signin, signup
├── (dashboard)/     # Authenticated manager & tenant areas
└── api/             # REST handlers: auth, geocode, S3 upload/delete
```

- **[`proxy.ts`](proxy.ts)** — Next.js “proxy” (middleware-style) gate: redirects signed-in users away from `/signin` and `/signup` when appropriate.
- **Route groups** `(main)`, `(auth)`, and `(dashboard)` organize layouts without changing URL structure.
- **Server components** and **server actions** load data and enforce role checks (`requireManager` / `requireTenant` patterns) where needed.

Domain entities in the database include **User**, **Manager**, **Tenant**, **Property**, **Location**, **Application**, **Lease**, and **Payment**, with enums for amenities, highlights, property types, and application/payment statuses (see [`prisma/schema.prisma`](prisma/schema.prisma)).

---

## Prerequisites

- **Node.js** (LTS recommended; matches the version range supported by Next.js 16)
- **npm**, **pnpm**, **yarn**, or **bun**
- A **PostgreSQL** database (e.g. [Neon](https://neon.tech))
- **Google OAuth** credentials (for “Sign in with Google”)
- **S3-compatible storage** (bucket + IAM-capable endpoint URLs for uploads)

---

## Environment variables

Configuration is validated with Zod in [`lib/env.ts`](lib/env.ts). Set the following in `.env` (or your host’s secret store):

### Server-only

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret for signing sessions/tokens |
| `BETTER_AUTH_URL` | Public URL of the app (e.g. `http://localhost:3000` in dev) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `AWS_ACCESS_KEY_ID` | Access key for S3 API |
| `AWS_SECRET_ACCESS_KEY` | Secret key |
| `AWS_ENDPOINT_URL_S3` | S3 API endpoint URL |
| `AWS_ENDPOINT_URL_IAM` | IAM endpoint URL (as required by your provider) |
| `AWS_REGION` | Region string |

### Client (public)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES` | Bucket name used for image URLs on the client |

Never commit real secrets. Add `.env` to `.gitignore` (default for Next.js projects).

---

## Getting started

1. **Clone the repository** and install dependencies:

   ```bash
   npm install
   ```

2. **Create `.env`** using the variables above (see [`lib/env.ts`](lib/env.ts) for the canonical list).

3. **Generate the Prisma client** and apply migrations (adjust commands if you use a custom migration workflow):

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js in development mode with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start production server (after `build`) |
| `npm run lint` | Run ESLint |

---

## Project structure

| Path | Role |
|------|------|
| [`app/`](app/) | Routes, layouts, and UI by segment (main, auth, dashboard) |
| [`components/`](components/) | Shared UI (e.g. property cards, design system) |
| [`lib/`](lib/) | Auth, DB, env, queries, validations, SEO helpers |
| [`prisma/`](prisma/) | Schema and migrations |
| [`hooks/`](hooks/) | Client hooks (search, filters, uploads, etc.) |
| [`proxy.ts`](proxy.ts) | Auth-page redirect proxy / middleware matcher |

---

## Authentication and roles

- Users sign up with **email/password** and optional **Google** OAuth.
- Each user has a **role** (e.g. `tenant` or `manager`). On registration, Better Auth hooks create the corresponding **Tenant** or **Manager** profile row.
- **Dashboard routes** are separated by URL prefix (`/managers/...` vs `/tenants/...`) and protected with server-side session checks and role guards.

---

## Deployment notes

- Set all environment variables on your hosting provider (e.g. Vercel, Railway, Docker).
- Ensure `BETTER_AUTH_URL` matches the production origin (including `https`).
- Run `npm run build` in CI and use `npm run start` or the platform’s Next.js integration.
- Configure your S3-compatible bucket CORS and policies for browser uploads via presigned URLs.

---

## License

This project is **private** (`"private": true` in [`package.json`](package.json)). Add a public license file if you open-source the repository.

---

*Built with Next.js, Prisma, and Better Auth — a rental marketplace focused on clarity for both tenants and property managers.*
