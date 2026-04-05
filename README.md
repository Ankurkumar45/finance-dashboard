# Finance Dashboard Backend (MERN) — Finance Data Processing & Access Control

Backend API for a finance dashboard system supporting:
- User + role management (viewer / analyst / admin)
- Financial records (transactions) CRUD + filtering
- Dashboard summary analytics (totals, trends, breakdowns)
- Role-based access control (RBAC)
- Validation + consistent error handling
- MongoDB persistence + soft delete

---

## Tech Stack
- **Node.js**, **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** Authentication
- **express-validator** for input validation
- **express-rate-limit** for basic rate limiting

---

## Features (mapped to assignment)
### 1) User & Role Management
- Create/login users
- Roles: `viewer`, `analyst`, `admin`
- User status: `active` / `inactive`
- Soft delete users (`isDeleted`)

### 2) Financial Records Management
- Transaction fields: `amount`, `type`, `category`, `date`, `description`
- CRUD supported (create/update/delete restricted to admins)
- Filtering: `type`, `category`, date range, search
- Pagination support

### 3) Dashboard Summary APIs
- Total income, total expenses, net balance
- Category-wise totals (breakdown)
- Recent activity
- Monthly and weekly trends (aggregation)

### 4) Access Control (RBAC)
- Enforced at backend routes via middleware
- Viewer: read-only (dashboard + transactions)
- Analyst: can read users + insights
- Admin: full management (transactions + users)

### 5) Validation & Error Handling
- `express-validator` for request validation
- Proper HTTP status codes: 400/401/403/404/409/500
- Central error middleware + helpful messages

### 6) Data Persistence
- MongoDB collections: `users`, `transactions`
- Indexes for query performance
- Soft delete filtering via Mongoose pre-find hooks

---

## Project Setup

### Prerequisites
- Node.js >= 18 (recommended)
- MongoDB (local or Atlas)

### Install dependencies
```bash
cd backend
npm install
