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
- PostgreSQL (or use the included docker-compose)

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
DB_DATABASE=monolith_db
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
