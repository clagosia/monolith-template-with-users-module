# Monolith Template with Users Module

A modularized NestJS monolith template with **User Administration**, **Authentication (JWT)**, and **Role-Based Access Control (RBAC)**. Designed to be cloned and used as a starter template for projects that need user management out of the box.

## Architecture

```
src/
├── common/                    # Shared utilities
│   ├── decorators/            # @Public(), @Roles() decorators
│   ├── filters/               # Global exception filter
│   ├── guards/                # JWT auth guard, Roles guard
│   └── interfaces/            # Auth provider interface (AD-compatible)
├── config/                    # Database & JWT configuration
├── users/                     # Users module
│   ├── dto/                   # CreateUserDto, UpdateUserDto
│   ├── entities/              # User entity
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── auth/                      # Authentication module
│   ├── dto/                   # Register, Login, Password DTOs
│   ├── entities/              # UserCredential entity
│   ├── strategies/            # JWT & Local Passport strategies
│   ├── access-control/        # RBAC sub-module
│   │   ├── dto/               # CRUD & association DTOs
│   │   ├── entities/          # Role, Permission, Action, Source, UserRole
│   │   ├── access-control.controller.ts
│   │   ├── access-control.service.ts
│   │   └── access-control.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── app.module.ts
└── main.ts
```

## Features

- **Users Module** - CRUD for user profiles (username, first name, last name, email, phone)
- **Authentication Module** - JWT-based auth with Passport strategies
  - Register, Login, Password Recovery, Reset Password
  - Update password, Update username
  - Soft delete & hard delete credentials
  - UUID v4 for all entity IDs
- **Access Control Sub-module (RBAC)** - Enterprise-grade role-based access control
  - **Roles** - CRUD + assign roles to users
  - **Permissions** - CRUD + assign permissions to roles
  - **Actions** - CRUD + assign actions to permissions (e.g., CREATE, READ, UPDATE, DELETE)
  - **Sources** - CRUD + assign sources to permissions (e.g., resource/module names)
- **AD-Compatible** - Auth provider interface for future Active Directory / LDAP integration
- **Global JWT Guard** - All endpoints protected by default; use `@Public()` to opt out
- **Comprehensive Tests** - 119 unit tests + e2e test suite

## Prerequisites

- Node.js >= 18
- PostgreSQL (or use the included docker-compose, or use **Mock DB mode** for zero-setup)

## Getting Started

### 1. Clone the template

```bash
git clone https://github.com/clagosia/monolith-template-with-users-module.git my-project
cd my-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and JWT secret:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=monolith_template
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=1h
APP_PORT=3000
```

### 4. Start the database (optional - Docker)

```bash
docker-compose up -d
```

### 5. Run the application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Mock Database Mode (No PostgreSQL Required)

For quick exploration or local development without setting up PostgreSQL, the template includes a **mock database mode** that uses SQLite. It comes with a seed script that pre-populates the database with sample users, roles, permissions, actions, and sources.

### Quick Start (one command)

```bash
# Seeds the SQLite DB and starts the server in watch mode
npm run mock
```

The server starts at `http://localhost:3000` with these pre-seeded accounts:

| Username  | Password      | Role    | Description                          |
|-----------|---------------|---------|--------------------------------------|
| `admin`   | `password123` | admin   | Full system access                   |
| `manager` | `password123` | manager | User and report management           |
| `viewer`  | `password123` | viewer  | Read-only access                     |

### Step-by-Step

If you prefer to run seed and server separately:

```bash
# 1. Seed the mock database
npm run seed:mock

# 2. Start the server with mock DB
npm run start:mock
```

### Try the API

Once the mock server is running, you can test the endpoints:

```bash
# Login as admin
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}' | jq .

# Copy the accessToken from the response, then:
TOKEN="<paste-access-token-here>"

# List all users
curl -s http://localhost:3000/users -H "Authorization: Bearer $TOKEN" | jq .

# List all roles
curl -s http://localhost:3000/access-control/roles -H "Authorization: Bearer $TOKEN" | jq .

# List all permissions (with actions and sources)
curl -s http://localhost:3000/access-control/permissions -H "Authorization: Bearer $TOKEN" | jq .

# Create a new user
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "newuser", "password": "securepass", "firstName": "New", "lastName": "User", "email": "new@example.com"}' | jq .
```

### Seeded RBAC Structure

The seed script creates the following access control hierarchy:

```
Roles:
  admin   --> manage_users, manage_roles, view_reports, manage_settings
  manager --> manage_users, view_reports
  viewer  --> view_reports, view_users

Permissions:
  manage_users    --> Actions: [CREATE, READ, UPDATE, DELETE]  Sources: [users]
  manage_roles    --> Actions: [CREATE, READ, UPDATE, DELETE]  Sources: [roles]
  view_reports    --> Actions: [READ]                          Sources: [reports]
  manage_settings --> Actions: [CREATE, READ, UPDATE, DELETE]  Sources: [settings]
  view_users      --> Actions: [READ]                          Sources: [users]
```

### Available Mock Scripts

| Script            | Description                                            |
|-------------------|--------------------------------------------------------|
| `npm run mock`    | Seed + start server (all-in-one)                       |
| `npm run seed:mock` | Seed the SQLite database only                        |
| `npm run start:mock` | Start the server with SQLite (watch mode)           |
| `npm run seed`    | Seed using the default PostgreSQL connection           |

### Notes

- The mock database is stored at `./mock.sqlite` in the project root. Delete it to reset.
- Mock mode uses `synchronize: true` so the schema is auto-created on startup.
- The seed script is idempotent -- running it multiple times will not create duplicates.
- You can also seed your PostgreSQL database with the same data using `npm run seed`.

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| POST   | `/auth/register`      | No   | Register a new user      |
| POST   | `/auth/login`         | No   | Login with credentials   |
| POST   | `/auth/password-recovery` | No | Request password reset |
| POST   | `/auth/reset-password`| No   | Reset password with token|
| PATCH  | `/auth/password`      | Yes  | Update password          |
| PATCH  | `/auth/username`      | Yes  | Update username          |
| DELETE | `/auth/:id`           | Yes  | Soft delete credentials  |
| DELETE | `/auth/:id/permanent` | Yes  | Hard delete credentials  |

### Users (`/users`)

| Method | Endpoint      | Auth | Description        |
|--------|---------------|------|--------------------|
| POST   | `/users`      | Yes  | Create a user      |
| GET    | `/users`      | Yes  | Get all users      |
| GET    | `/users/:id`  | Yes  | Get user by ID     |
| PATCH  | `/users/:id`  | Yes  | Update a user      |
| DELETE | `/users/:id`  | Yes  | Delete a user      |

### Access Control (`/access-control`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST/GET/PATCH/DELETE | `/access-control/roles` | Yes | CRUD for roles |
| POST/GET/PATCH/DELETE | `/access-control/permissions` | Yes | CRUD for permissions |
| POST/GET/PATCH/DELETE | `/access-control/actions` | Yes | CRUD for actions |
| POST/GET/PATCH/DELETE | `/access-control/sources` | Yes | CRUD for sources |
| POST/GET/DELETE | `/access-control/user-roles` | Yes | User-Role associations |
| POST/DELETE | `/access-control/role-permissions` | Yes | Role-Permission associations |
| POST/DELETE | `/access-control/permission-actions` | Yes | Permission-Action associations |
| POST/DELETE | `/access-control/permission-sources` | Yes | Permission-Source associations |

## Testing

```bash
# Unit tests
npm run test

# E2E tests (uses SQLite in-memory)
npm run test:e2e

# Test coverage
npm run test:cov
```

## RBAC Model

```
User --> UserRole --> Role --> RolePermission --> Permission
                                                    |-- PermissionAction --> Action
                                                    |-- PermissionSource --> Source
```

- **User** has many **Roles** (via UserRole)
- **Role** has many **Permissions** (via join table)
- **Permission** has many **Actions** and **Sources** (via join tables)
- **Action** represents what can be done (CREATE, READ, UPDATE, DELETE)
- **Source** represents on what resource (users, orders, reports, etc.)

## Using as a Template

1. Clone this repository
2. Update `package.json` with your project name
3. Configure your `.env` file
4. Add your own modules alongside the existing ones
5. Use `@Roles('admin')` decorator on endpoints that need role protection
6. Use `@Public()` decorator on endpoints that should be publicly accessible

## License

[MIT](LICENSE)
