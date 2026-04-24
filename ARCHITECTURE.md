# System Architecture Guide

This file explains how the YumYum Recipe Nest codebase is organized and how data flows through the system.

## 1) High-Level Overview

The project is split into two apps:

- `client/`: React UI (Vite dev server)
- `server/`: Express API + MongoDB access

Both run together from the root using `concurrently` (`npm run dev`).

## 2) Frontend Architecture (`client/src`)

## Routing and role flow

- `App.jsx` defines all routes.
- `RootRoute` and `PostLoginRedirect` send users to pages by role.
- `ProtectedRoute` guards private pages by required roles.

Role sections:
- Public pages (`/`, `/recipes`, `/about`, etc.)
- User area (`/home`, `/saved`, `/profile`)
- Chef area (`/chef/dashboard`, recipe create/edit)
- Admin area (`/admin/dashboard`, users, chefs, pending recipes, contacts, recipe comments)

## Layout shells

- `UserShell.jsx`, `ChefShell.jsx`, `AdminShell.jsx`
- Each shell provides sidebar/header frame and renders nested routes via `Outlet`.

## API layer

- `api/http.js` is a shared Axios instance.
- It attaches JWT token from `localStorage` as `Authorization: Bearer <token>`.
- It normalizes network/server errors into readable messages.

## State model

- Most pages use local component state (`useState`, `useEffect`) for API data.
- Global auth state is in `context/AuthContext.jsx` (current user + login/logout lifecycle).

## Styling

- `index.css` is the main design system file (variables + global components + page styles).
- Uses theme variables and reusable classes (buttons, cards, tables, panels).

## 3) Backend Architecture (`server/src`)

## Entry and app setup

- `server.js` loads env, connects DB, starts Express server.
- `app.js` configures middleware and mounts route groups.

Mounted base routes:
- `/api/auth`
- `/api/categories`
- `/api/recipes`
- `/api/users`
- `/api/chef`
- `/api/chefs`
- `/api/contact`
- `/api/admin`

## Data models (Mongoose)

- `User`: account + role + profile + status
- `Recipe`: content + chef + category + approval status + likes + rating metrics
- `Review`: per-user recipe review/comment (+ hidden flag)
- `Category`: recipe categories
- `SavedRecipe`: favorites / cook-later mapping
- `ContactMessage`: contact form submissions

## Route -> controller pattern

Each route file wires HTTP endpoints to controller functions:

- Routes: validate/auth/role checks + endpoint shape
- Controllers: business logic + DB queries + response

Examples:
- `recipeRoutes.js` -> `recipeController.js`
- `adminRoutes.js` -> `adminController.js`
- `authRoutes.js` -> `authController.js`

## Middleware chain

- `authMiddleware.js` (`protect`): validates JWT and attaches `req.user`
- `roleMiddleware.js` (`requireRoles`): role-based authorization
- `validateRequest.js`: handles `express-validator` results
- `errorMiddleware.js`: centralized 404/error response handling
- `uploadMiddleware.js`: multer-based file upload handling

## 4) Main Business Flows

## Authentication

1. User registers/logs in (`/api/auth/...`)
2. Server returns JWT
3. Client stores token and sends it in future requests
4. Protected endpoints validate token + role

## Recipe lifecycle

1. Chef creates recipe -> status `pending`
2. Admin reviews pending recipes (`/api/admin/recipes/pending`)
3. Admin approves/rejects (`/api/admin/recipes/:id/status`)
4. Approved recipes appear in public/user listings

## Reviews/comments

1. Authenticated user posts review on recipe
2. Review saved in `Review`
3. Recipe rating aggregates are recalculated
4. Admin can view and delete recipe comments from admin tools

## Contact moderation

1. Visitor submits contact form (`/api/contact`)
2. Stored in `ContactMessage`
3. Admin lists and deletes entries via `/api/admin/contacts` endpoints

## 5) File and Dependency Responsibilities

## Root

- `package.json`: scripts to run/install both apps

## Client

- `main.jsx`: app bootstrap
- `App.jsx`: routing tree
- `context/AuthContext.jsx`: auth state
- `pages/*`: page-level features
- `components/*`: reusable UI

## Server

- `server.js`: process startup
- `app.js`: middleware + route mounts
- `models/*`: Mongo schemas
- `controllers/*`: use-case logic
- `routes/*`: endpoint mapping
- `middleware/*`: shared request pipeline helpers

## 6) Operational Notes

- Backend must be running for frontend proxy API calls to work.
- MongoDB must be reachable, otherwise server startup fails before serving routes.
- If you get `Not found` for admin APIs, first confirm:
  - server is running
  - correct route path
  - authenticated admin token is present

## 7) Suggested Next Improvements

- Add automated tests (API integration + UI smoke tests)
- Split large CSS into modular files
- Add pagination/filtering on heavy admin lists
- Add API docs (OpenAPI/Swagger)
