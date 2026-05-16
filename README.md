# Smart Leads Dashboard

A production-quality lead management SaaS dashboard built with the MERN stack and strict TypeScript. Authenticated users can manage sales leads with advanced filtering, pagination, search, role-based access control, CSV export, and analytics.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Node](https://img.shields.io/badge/Node-20-green) ![MongoDB](https://img.shields.io/badge/MongoDB-7-green)

## Features

- **JWT Authentication** — Register, login, protected routes, persistent sessions
- **Lead CRUD** — Create, read, update, delete (admin only) with validation
- **Advanced Filtering** — Status, source, name/email search, sort (latest/oldest) — all combinable
- **Server-side Pagination** — 10 leads per page with metadata
- **CSV Export** — Export filtered results with timestamped filename
- **RBAC** — Admin (full access) vs Sales (no delete)
- **Dashboard Analytics** — Stats cards and breakdown charts
- **Modern UI** — Responsive sidebar layout, dark mode, toasts, skeletons, empty states

## Tech Stack

| Layer    | Technologies |
|----------|-------------|
| Frontend | React, TypeScript, TailwindCSS, React Router, Axios, React Hook Form, Zod, Zustand, TanStack Query |
| Backend  | Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs |
| DevOps   | Docker, Docker Compose, ESLint, Prettier |

## Project Structure

```
smart-leads-dashboard/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── api/            # API client & endpoints
│       ├── components/     # Reusable UI & feature components
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Route pages
│       ├── store/          # Zustand stores
│       ├── schemas/        # Zod validation schemas
│       └── types/          # Shared TypeScript types
├── server/                 # Express API
│   └── src/
│       ├── config/         # Environment & database
│       ├── controllers/    # Route handlers
│       ├── services/       # Business logic
│       ├── repositories/   # Data access layer
│       ├── middlewares/    # Auth, validation, rate limiting
│       ├── models/         # Mongoose schemas
│       └── validators/     # Zod request validators
├── docs/                   # API documentation
└── docker-compose.yml
```

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

### 1. Clone & install

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Environment variables

**Server** (`server/.env`):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed database (optional)

```bash
cd server
npm run seed
```

Demo accounts:
- **Admin:** `admin@smartleads.com` / `admin123`
- **Sales:** `sales@smartleads.com` / `sales123`

### 4. Run development servers

```bash
# Terminal 1 — API
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api
- MongoDB: localhost:27017

## API Documentation

See [docs/API.md](docs/API.md) for complete endpoint reference, request/response examples, and error codes.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/leads` | List leads (filtered, paginated) |
| GET | `/api/leads/export` | Export CSV |
| GET | `/api/leads/stats` | Dashboard stats |
| POST | `/api/leads` | Create lead |
| PATCH | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead (admin) |

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | server/client | Start dev server |
| `npm run build` | server/client | Production build |
| `npm run seed` | server | Seed demo data |
| `npm run lint` | server/client | Run ESLint |

## Deployment

| Service  | Platform | Notes |
|----------|----------|-------|
| Frontend | Vercel | Set `VITE_API_URL` to production API |
| Backend  | Render / Railway | Set all env vars from `.env.example` |
| Database | MongoDB Atlas | Use connection string in `MONGODB_URI` |

## Screenshots

> Add screenshots of the dashboard, leads table, and filters here after running the app.

## Security

- Helmet, CORS, rate limiting
- bcrypt password hashing
- JWT access tokens with expiration
- express-mongo-sanitize for injection prevention
- Zod request validation on all inputs

## License

MIT
