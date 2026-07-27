# LeadFlow — Frontend

React + TypeScript + Redux Toolkit client for the LeadFlow lead management platform.
Full architecture, roles/permissions, and API docs live in the
[root README](../README.md) — this file is a quick reference for working in this
folder.

## Stack

React 19, TypeScript, Vite, Redux Toolkit + `redux-persist` (auth only), React Router
v7, Tailwind CSS v4, React Hook Form, Axios, `react-toastify`, `react-paginate`.

## Structure

```
src/
├── app/                 Redux store + root reducer
├── features/            one folder per domain — auth, leads, users
│   └── <feature>/        types, service (axios calls), async thunks, slice
├── endpoints/            API path constants per feature
├── middleware/           Axios instance + auth-token/401 interceptor
├── components/
│   ├── layout/AppShell    authenticated nav shell
│   ├── routes/            ProtectedRoute (auth + role gating)
│   └── leads/             StatusBadge etc.
├── pages/
│   ├── public/LeadCapture  unauthenticated capture form ("/")
│   ├── auth/Login
│   ├── leads/              LeadsList, LeadDetail, NewLead
│   └── admin/Users         admin-only user management
└── shared/               toast service, generic API response types
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server (`http://localhost:5173`) |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint |

## Environment variables

`VITE_API_BASE_URL` — the backend's API base URL (see `.env.example`), e.g.
`http://localhost:5000/api` in development.
