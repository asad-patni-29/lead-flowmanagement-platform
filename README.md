# LeadFlow — Lead Management Platform

A full-stack lead management system built with **Express + React + TypeScript + MongoDB**. Manage leads, assign tasks, track activity, and collaborate with your team.

---

## 🏗️ Architecture Overview

LeadFlow is a monorepo with two main applications:

- **Backend** (`/Backend`) — Express.js API with TypeScript, MongoDB, JWT authentication
- **Client** (`/Client`) — React 19 SPA with Redux Toolkit, Tailwind CSS, React Router v7

Both are fully type-safe and follow modern best practices for scalability and maintainability.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (preferably 18+)
- **MongoDB** (local or Atlas)
- **npm** 8+

### Setup

1. **Clone the repo** and install dependencies:

```bash
cd Backend && npm install
cd ../Client && npm install
```

2. **Configure environment variables:**

   **Backend** (`Backend/.env`):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/leadflow
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   ```

   **Client** (`Client/.env`):
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

   > Copy `.env.example` files in each folder for reference.

3. **Seed demo data** (backend):

```bash
cd Backend
npm run seed
```

This creates:
- **Admin account:** `admin@leadflow.test` / `Admin@123`
- **9 member accounts:** `member1@leadflow.test` through `member9@leadflow.test` / `Member@123`
- **20 sample leads** assigned to various team members

4. **Start both servers:**

```bash
# Terminal 1: Backend
cd Backend && npm run dev

# Terminal 2: Client
cd Client && npm run dev
```

Backend runs on `http://localhost:5000`, client on `http://localhost:5173`.

---

## 📁 Folder Structure

### Backend

```
Backend/
├── src/
│   ├── config/          Environment & database configuration
│   ├── models/          Mongoose schemas (User, Lead)
│   ├── controllers/      Route handlers (auth, users, leads, public, health)
│   ├── routes/          Express routers
│   ├── middleware/       Auth (JWT + role checks), validation, error handling
│   ├── validators/       Zod request schemas
│   ├── utils/           JWT helpers, pagination utilities
│   ├── tests/           Jest tests + in-memory MongoDB test utilities
│   ├── app.ts          Express app setup
│   ├── server.ts       Server entry point
│   └── seed.ts         Demo data seeder
├── dist/               Compiled TypeScript (generated)
├── package.json
├── tsconfig.json
└── jest.config.ts
```

### Client

```
Client/
├── src/
│   ├── app/            Redux store & root reducer
│   ├── features/        Domain-based organization (auth, leads, users)
│   │   └── <feature>/   types, service, async thunks, Redux slice
│   ├── endpoints/      API path constants per feature
│   ├── middleware/      Axios instance + interceptors
│   ├── components/
│   │   ├── layout/     AppShell (authenticated navigation)
│   │   ├── routes/     ProtectedRoute (auth + role gating)
│   │   ├── common/     Reusable UI components
│   │   └── leads/      Lead-specific components
│   ├── pages/
│   │   ├── public/     LeadCapture (unauthenticated)
│   │   ├── auth/       Login
│   │   ├── leads/      LeadsList, LeadDetail, NewLead
│   │   └── admin/      Users (admin only)
│   ├── shared/         Toast service, generic API types
│   ├── hooks/          Custom React hooks (useDebounce, etc.)
│   ├── constants/      App-wide constants (roles, Redux keys)
│   ├── App.tsx         Main app component
│   └── main.tsx        Vite entry point
├── dist/               Production build (generated)
├── public/            Static assets (icons, favicon)
├── index.html         HTML template
├── package.json
└── vite.config.ts
```

---

## 🔐 Authentication & Authorization

### Roles

- **Admin** — full access to users, leads, and admin panel
- **Member** — can create/edit leads, view assigned leads only

### Flow

1. User logs in with email + password
2. Backend issues JWT token (valid 24h by default)
3. Client stores token in Redux + localStorage (persist)
4. Axios interceptor attaches token to all API requests
5. Backend middleware verifies JWT + checks role for protected routes
6. On 401/token expiration, client redirects to login

### Protected Routes

- `/admin/users` — admin only
- `/leads` — authenticated users
- `/leads/new` — authenticated users
- `/leads/:id` — authenticated users (own or team leads based on role)

---

## 📡 API Reference

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login with email + password, returns JWT |

### Users (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | List all users (paginated) |
| `POST` | `/users` | Create a new user |
| `PUT` | `/users/:id` | Update user (name, email, password, role) |
| `DELETE` | `/users/:id` | Delete user |

**Query params:** `page`, `limit`, `search`, `sortBy` (`name`, `email`, `createdAt`), `sortOrder` (`asc`, `desc`)

### Leads

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/leads` | List leads (authenticated, filtered by role) |
| `POST` | `/leads` | Create a new lead |
| `GET` | `/leads/:id` | Fetch a single lead by ID |
| `PUT` | `/leads/:id` | Update lead (name, email, status, company, assignedTo, etc.) |
| `DELETE` | `/leads/:id` | Delete lead (admin only) |
| `POST` | `/leads/:id/notes` | Add note to a lead |
| `GET` | `/leads/:id/activity` | Fetch activity trail for a lead |

**Query params (list):** `page`, `limit`, `status`, `assignedTo`, `search`, `sortBy` (`name`, `createdAt`), `sortOrder` (`asc`, `desc`)

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/public/leads/capture` | Capture lead from public form (no auth) |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health status |

---

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (`jsonwebtoken`) + bcryptjs
- **Validation:** Zod
- **Security:** Helmet, CORS, express-rate-limit
- **Testing:** Jest, Supertest, mongodb-memory-server

### Client

- **Framework:** React 19
- **Language:** TypeScript
- **Bundler:** Vite
- **State Mgmt:** Redux Toolkit + redux-persist
- **Router:** React Router v7
- **Styling:** Tailwind CSS v4
- **Forms:** React Hook Form
- **HTTP:** Axios
- **UI:** React Toastify, react-paginate

---

## 📝 Common Tasks

### Backend

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Type-check & compile | `npm run build` |
| Run production build | `npm start` |
| Run tests | `npm test` |
| Seed demo data | `npm run seed` |

### Client

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |
| Run ESLint | `npm run lint` |

---

## 🧪 Testing

### Backend

Unit and integration tests are in `Backend/src/tests/`. Uses Jest + Supertest for HTTP testing and `mongodb-memory-server` for isolated database tests.

```bash
cd Backend && npm test
```

Tests cover:
- Authentication (login, JWT verification)
- Lead CRUD operations
- Pagination & filtering
- Role-based access control

### Client

Client-side testing is scaffolded but can be extended with Vitest or Jest.

---

## 🚢 Deployment

### Backend (Heroku / Railway / Vercel)

1. **Build:** `npm run build` generates `dist/`
2. **Procfile** (for Heroku): `web: npm start`
3. **Environment variables:** Set `MONGODB_URI` and `JWT_SECRET` in your hosting platform's config
4. Start command: `npm start` (runs from `dist/`)

### Client (Vercel / Netlify / GitHub Pages)

1. **Build:** `npm run build` generates `dist/`
2. **Deploy:** Upload `dist/` folder to your hosting service
3. **Environment:** Set `VITE_API_BASE_URL` to your production API URL
4. **Routing:** Configure your host to redirect all routes to `index.html` (SPA fallback)

---

## 🔗 API Response Format

All API responses follow a consistent JSON structure:

```json
{
  "success": true,
  "data": { /* resource data */ },
  "meta": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 },
  "message": "Optional success message"
}
```

On error:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error type",
  "stack": "Stack trace (dev only)"
}
```

---

## 🐛 Troubleshooting

### Backend won't start

- Ensure MongoDB is running: `mongod` (local) or check your Atlas connection string
- Check `MONGODB_URI` in `.env`
- Verify port 5000 is not in use: `lsof -i :5000`

### Client dev server issues

- Clear `node_modules/` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Ensure `VITE_API_BASE_URL` is set correctly in `.env`

### JWT token expired

- Token is valid for 24 hours by default
- On 401 response, client automatically redirects to login
- New login generates a fresh token

### CORS errors

- Backend has CORS enabled for `http://localhost:5173` (dev)
- For production, update `src/app.ts` CORS origin config

---

## 📚 Key Features

- ✅ **Full-stack TypeScript** for type safety
- ✅ **Role-based access control** (Admin / Member)
- ✅ **JWT authentication** with refresh logic
- ✅ **Lead management** with status tracking, notes, activity trail
- ✅ **Lead assignment** to team members
- ✅ **Public lead capture form** (no auth required)
- ✅ **Pagination, filtering, and sorting** on all list endpoints
- ✅ **Responsive UI** with Tailwind CSS
- ✅ **Redux state management** with persistence
- ✅ **Error handling & toast notifications**
- ✅ **MongoDB with Mongoose** for scalable data storage
- ✅ **Jest tests** with in-memory database

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Write tests for new functionality
3. Run `npm run build` to ensure types are valid
4. Commit and push: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

This project is provided as-is for educational and development purposes.

---

## ❓ Questions?

- **Backend questions?** Check `Backend/src/` folder structure and comments
- **Frontend questions?** Check `Client/src/` folder structure and Redux slices
- **API questions?** Refer to the API Reference section above or check route files in `Backend/src/routes/`

---

**Happy coding! 🎉**
