# LeadFlow — Backend

Express + TypeScript + MongoDB API for the LeadFlow lead management platform.
Full architecture, API reference, roles/permissions, and deployment docs live in the
[root README](../README.md) — this file is a quick reference for working in this
folder.

## Stack

Express, TypeScript, Mongoose, JWT (`jsonwebtoken` + `bcryptjs`), Zod for request
validation, Helmet/CORS/`express-rate-limit` for hardening, Jest + Supertest +
`mongodb-memory-server` for tests.

## Structure

```
src/
├── config/       env loading, MongoDB connection
├── models/       Mongoose schemas: User, Lead
├── middleware/   auth (JWT + role checks), Zod validation, error handler
├── validators/   Zod request schemas
├── controllers/  route handlers (auth, users, leads, public capture, health)
├── routes/       Express routers, mounted in routes/index.ts
├── utils/        JWT sign/verify, pagination helpers
├── tests/        Jest test suites + in-memory-DB test helpers
└── seed.ts       creates demo admin/member accounts + sample leads
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server with hot-reload (`http://localhost:5000`) |
| `npm run build` | Type-check and compile to `dist/` |
| `npm start` | Run the compiled build |
| `npm run seed` | Seed demo users + sample leads (see root README for credentials) |
| `npm test` | Run the Jest suite against an in-memory MongoDB |

## Environment variables

See `.env.example`. `MONGODB_URI` is required (local Mongo or Atlas); `JWT_SECRET`
should be changed before any real deployment.
