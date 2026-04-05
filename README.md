# Zorvyn Fintech - MERN Stack Finance Dashboard

A full-stack financial management platform with role-based access control, real-time analytics, and secure user management. Built with MongoDB, Express.js, React, and Node.js.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [High-Level Design (HLD)](#high-level-design-hld)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Role-Based Access Control](#role-based-access-control)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Security Considerations](#security-considerations)

---

## Problem Statement

Financial organizations need a secure, scalable platform to manage financial records with granular access control. The challenges include:

1. **Access Control**: Different user roles (Admins, Analysts, Viewers) need varying levels of access to financial data
2. **Data Integrity**: Financial records must be protected from unauthorized modifications with proper validation
3. **Analytics**: Real-time dashboard insights are needed for decision-making
4. **Scalability**: The system must handle growing volumes of financial data efficiently
5. **Security**: Sensitive financial data requires robust authentication and authorization

---

## Solution Overview

Zorvyn Fintech addresses these challenges through:

- **JWT-based Authentication** with bcrypt password hashing
- **Role-Based Access Control (RBAC)** with middleware-level enforcement
- **MongoDB Aggregation Pipelines** for efficient analytics computation
- **Zod Schema Validation** for type-safe request validation
- **Soft Deletes** to maintain audit trails
- **Pagination & Filtering** for performant data retrieval at scale
- **Production-ready CORS** configuration for multi-environment deployment

---

## Features

### Authentication & Authorization
- User login with JWT token-based authentication
- Self-service signup for new users (Viewer role by default)
- Session persistence via localStorage
- Automatic token expiry handling

### Role-Based Access Control
- **Admin**: Full access - manage users, create/edit/delete records, view analytics
- **Analyst**: Read access to records and analytics
- **Viewer**: Dashboard analytics only

### Financial Records Management
- Create, read, update, and delete financial records
- Record types: INCOME and EXPENSE
- Categorization with custom categories
- Date-based filtering and search
- Pagination support (configurable page size)
- Soft delete implementation for audit compliance
- Created-by tracking for accountability

### Dashboard Analytics
- Total income, expenses, and net balance summary
- Category-wise breakdown of transactions
- Recent activity feed (latest 10 records)
- Monthly income vs expense trends
- Date range filtering for all analytics

### User Management (Admin Only)
- Create new users with specific roles
- Edit user details (name, email, role, status)
- Toggle user active/inactive status
- View paginated user list

### Profile Management
- Update name and password
- View current role and status
- Real-time profile sync across the app

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 18+ | Runtime environment |
| Express.js 5 | Web framework |
| MongoDB + Mongoose | Database and ODM |
| JWT + bcryptjs | Authentication and password hashing |
| Zod | Request validation |
| Helmet | HTTP security headers |
| CORS | Cross-origin resource sharing |
| Morgan | HTTP request logging |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| Vite | Build tool and dev server |
| Context API | Global state management |
| Fetch API | HTTP client |
| CSS | Styling with responsive design |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker + Docker Compose | Containerization |
| Vercel | Frontend deployment |
| Render | Backend deployment |
| MongoDB Atlas | Cloud database |

---

## High-Level Design (HLD)

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    React SPA (Vercel)                        │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │ │
│  │  │  Login   │ │Dashboard │ │ Records  │ │ Users/Profile │  │ │
│  │  │  Page    │ │  Page    │ │  Page    │ │    Pages      │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              AuthContext (State)                      │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              API Service Layer                        │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTPS / REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER (Render)                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   Express.js Server                          │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │ │
│  │  │  Auth    │ │  Users   │ │ Records  │ │  Dashboard    │  │ │
│  │  │ Routes   │ │ Routes   │ │ Routes   │ │   Routes      │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              Middleware Pipeline                      │  │ │
│  │  │  Helmet → CORS → JSON Parser → Morgan → Auth → Role  │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                    Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER (MongoDB Atlas)                   │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │    Users Collection  │  │      Records Collection          │ │
│  │  - name, email       │  │  - amount, type, category        │ │
│  │  - password (hashed) │  │  - date, notes, createdBy        │ │
│  │  - role, status      │  │  - isDeleted (soft delete)       │ │
│  │  - timestamps        │  │  - timestamps, indexes           │ │
│  └──────────────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow

```
Client Request
    │
    ▼
┌─────────────┐
│   Helmet    │ → Security headers
└──────┬──────┘
       ▼
┌─────────────┐
│    CORS     │ → Origin validation
└──────┬──────┘
       ▼
┌─────────────┐
│ JSON Parser │ → Body parsing
└──────┬──────┘
       ▼
┌─────────────┐
│   Morgan    │ → Request logging
└──────┬──────┘
       ▼
┌─────────────┐
│    Zod      │ → Schema validation
└──────┬──────┘
       ▼
┌─────────────┐
│    Auth     │ → JWT verification
└──────┬──────┘
       ▼
┌─────────────┐
│    Role     │ → Permission check
└──────┬──────┘
       ▼
┌─────────────┐
│ Controller  │ → Business logic
└──────┬──────┘
       ▼
┌─────────────┐
│  Mongoose   │ → Database operations
└──────┬──────┘
       ▼
    Response
```

### Component Architecture

```
App
├── AuthProvider (Context)
│   ├── user state
│   ├── login()
│   └── logout()
│
├── Login
│   ├── Login form
│   └── Signup form
│
└── Dashboard Layout (authenticated)
    ├── Header
    │   ├── Logo (Zorvyn Fintech)
    │   ├── Tab Navigation
    │   └── User Info + Logout
    │
    ├── Dashboard Page
    │   ├── SummaryCards
    │   ├── RecentActivity
    │   ├── CategoryBreakdown
    │   └── MonthlyTrend
    │
    ├── Records Page
    │   ├── Record Form (create/edit)
    │   ├── Filters
    │   ├── Records Table
    │   └── Pagination
    │
    ├── Users Page (Admin)
    │   ├── User Form (create/edit)
    │   └── Users Table
    │
    └── Profile Page
        ├── Profile Info
        └── Update Form
```

---

## System Architecture

### Deployment Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│      Vercel         │         │       Render        │
│   (Frontend)        │────────▶│    (Backend API)    │
│   React SPA         │  HTTPS  │   Express.js        │
│   Static Build      │         │   Node.js           │
└─────────────────────┘         └──────────┬──────────┘
                                           │
                                           ▼
                                 ┌─────────────────────┐
                                 │   MongoDB Atlas     │
                                 │   Cloud Database    │
                                 └─────────────────────┘
```

---

## Project Structure

```
zorvyn/
├── client/                          # React Frontend
│   ├── public/                      # Static assets
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/                  # Images and icons
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Analytics dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── Login.jsx            # Auth page
│   │   │   ├── Login.css
│   │   │   ├── Records.jsx          # Financial records CRUD
│   │   │   ├── Records.css
│   │   │   ├── Users.jsx            # User management
│   │   │   ├── Users.css
│   │   │   ├── Profile.jsx          # Profile settings
│   │   │   └── Profile.css
│   │   ├── services/
│   │   │   └── api.js               # API client with auth
│   │   ├── App.jsx                  # Main app + routing
│   │   ├── App.css                  # Global styles
│   │   ├── index.css                # Base styles
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── vite.config.js               # Vite + proxy config
│   ├── vercel.json                  # Vercel deployment config
│   └── package.json
│
├── src/                             # Express Backend
│   ├── config/
│   │   ├── index.js                 # App configuration
│   │   └── database.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Login/signup logic
│   │   ├── userController.js        # User CRUD + profile
│   │   ├── recordController.js      # Record CRUD
│   │   └── dashboardController.js   # Analytics aggregation
│   ├── middlewares/
│   │   ├── auth.js                  # JWT + role middleware
│   │   ├── validation.js            # Zod validation schemas
│   │   └── errorHandler.js          # Global error handler
│   ├── models/
│   │   ├── User.js                  # User schema + methods
│   │   └── Record.js                # Record schema + indexes
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth/*
│   │   ├── userRoutes.js            # /api/users/*
│   │   ├── recordRoutes.js          # /api/records/*
│   │   └── dashboardRoutes.js       # /api/dashboard/*
│   ├── scripts/
│   │   └── seed.js                  # Database seeder
│   ├── utils/
│   │   ├── appError.js              # Custom error class
│   │   └── token.js                 # JWT utilities
│   └── server.js                    # Express app entry
│
├── .env                             # Environment variables
├── .gitignore
├── Dockerfile                       # Backend container
├── docker-compose.yml               # Full stack containers
├── Procfile                         # Render process config
├── vercel.json                      # Root vercel config
└── package.json                     # Backend dependencies
```

---

## API Documentation

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-render-url.onrender.com/api`

### Authentication

#### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "admin@zorvyn.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@zorvyn.com",
    "role": "Admin",
    "status": "Active"
  }
}
```

#### POST `/api/auth/signup`
Create a new account (Viewer role by default).

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Users (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create a new user |
| GET | `/api/users?page=1&limit=20` | List all users (paginated) |
| PUT | `/api/users/:id` | Update user (role, status) |
| PATCH | `/api/users/:id/status` | Toggle active/inactive |
| PUT | `/api/users/profile` | Update own profile |

### Financial Records

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/api/records` | Admin | Create a record |
| GET | `/api/records?type=&category=&startDate=&endDate=&page=1&limit=20` | Admin, Analyst | List records with filters |
| GET | `/api/records/:id` | Admin, Analyst | Get single record |
| PUT | `/api/records/:id` | Admin | Update record |
| DELETE | `/api/records/:id` | Admin | Soft delete record |

### Dashboard Analytics

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/api/dashboard/summary?startDate=&endDate=` | All | Get dashboard analytics |

**Response:**
```json
{
  "summary": {
    "totalIncome": 50000,
    "totalExpenses": 30000,
    "netBalance": 20000
  },
  "categoryBreakdown": [
    { "_id": "Salary", "total": 45000, "type": "INCOME" }
  ],
  "recentActivity": [...],
  "monthlyTrend": [
    { "_id": { "year": 2024, "month": 1 }, "income": 15000, "expenses": 10000 }
  ]
}
```

---

## Role-Based Access Control

| Endpoint | Viewer | Analyst | Admin |
|----------|--------|---------|-------|
| `POST /api/auth/login` | ✅ | ✅ | ✅ |
| `POST /api/auth/signup` | ✅ | ✅ | ✅ |
| `GET /api/dashboard/summary` | ✅ | ✅ | ✅ |
| `PUT /api/users/profile` | ✅ | ✅ | ✅ |
| `GET /api/records` | ❌ | ✅ | ✅ |
| `GET /api/records/:id` | ❌ | ✅ | ✅ |
| `POST /api/records` | ❌ | ❌ | ✅ |
| `PUT /api/records/:id` | ❌ | ❌ | ✅ |
| `DELETE /api/records/:id` | ❌ | ❌ | ✅ |
| `GET /api/users` | ❌ | ❌ | ✅ |
| `POST /api/users` | ❌ | ❌ | ✅ |
| `PUT /api/users/:id` | ❌ | ❌ | ✅ |
| `PATCH /api/users/:id/status` | ❌ | ❌ | ✅ |

---

## Database Schema

### User Model
```javascript
{
  name: String (required, trim),
  email: String (required, unique, lowercase, trim),
  password: String (required, min: 6, bcrypt hashed),
  role: Enum ['Viewer', 'Analyst', 'Admin'] (default: 'Viewer'),
  status: Enum ['Active', 'Inactive'] (default: 'Active'),
  createdAt: Date,
  updatedAt: Date
}
```

### Record Model
```javascript
{
  amount: Number (required, min: 0),
  type: Enum ['INCOME', 'EXPENSE'] (required),
  category: String (required, trim),
  date: Date (required),
  notes: String (default: ''),
  createdBy: ObjectId (ref: User, required),
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
// Indexes: { type: 1, date: 1, category: 1 }
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prabhjot-Singh-2004/Zorvyn-Assessment-.git
   cd Zorvyn-Assessment-
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/zorvyn-finance
   JWT_SECRET=your-super-secret-key
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   docker run -d -p 27017:27017 --name zorvyn-mongo mongo:7
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```
   
   Demo accounts created:
   - **Admin:** `admin@zorvyn.com` / `admin123`
   - **Analyst:** `analyst@zorvyn.com` / `analyst123`
   - **Viewer:** `viewer@zorvyn.com` / `viewer123`

6. **Start development servers**
   ```bash
   npm run dev
   ```
   - Backend: `http://localhost:3000`
   - Frontend: `http://localhost:5173`

### Docker Setup
```bash
docker-compose up -d
docker-compose exec app npm run seed
```

---

## Deployment

### Frontend - Vercel

1. Connect your GitHub repo to Vercel
2. Set root directory to `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
6. Deploy

### Backend - Render

1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Environment:** Node
4. Add environment variables:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your-production-secret
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
5. Deploy

### Post-Deployment

1. Update the frontend `VITE_API_URL` with your Render backend URL
2. Update the backend `FRONTEND_URL` with your Vercel frontend URL
3. Run the seed script on the production database:
   ```bash
   # On Render shell
   npm run seed
   ```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/zorvyn-finance` |
| `JWT_SECRET` | JWT signing secret | `zorvyn-dev-secret-change-in-production` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `VITE_API_URL` | Backend API URL (frontend) | `http://localhost:3000/api` |

---

## Security Considerations

- **Password Hashing**: bcrypt with 10 rounds
- **JWT Tokens**: Signed with secret, 7-day expiry
- **Input Validation**: Zod schemas on all endpoints
- **HTTP Security**: Helmet for security headers
- **CORS**: Configured for specific origins in production
- **Soft Deletes**: Records are never permanently deleted
- **Role Enforcement**: Middleware-level RBAC checks
- **Error Handling**: Generic error messages (no stack traces in production)

---

## License

ISC
