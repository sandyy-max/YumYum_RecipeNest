# Recipe Nest (MERN)

Full‑stack MERN app:
- **Client**: React + Vite
- **Server**: Node.js + Express + MongoDB (Mongoose)
- **Auth**: JWT
- **Uploads**: Multer

## Folder Structure

```text
khel_khatam_beta_mern/
├─ client/                  # React (Vite) frontend
│  ├─ package.json
│  └─ src/
├─ server/                  # Express backend
│  ├─ package.json
│  ├─ .env.example
│  └─ src/
│     ├─ server.js
│     └─ scripts/
│        └─ seedAdmin.js
└─ package.json             # Root scripts (run both, install both)
```

## Prerequisites

- **Node.js**: 18+ recommended
- **npm**: comes with Node.js
- **MongoDB**: MongoDB Atlas or local MongoDB

## Environment Setup

Create `server/.env` and copy values from `server/.env.example`.

Example (`server/.env.example`):

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.example.mongodb.net/recipe_nest?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_long_random_string_in_production
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE_BYTES=2097152
```

### Notes

- **Do not commit** `server/.env` to GitHub.
- **`CLIENT_URL`** must match your frontend origin (CORS).
- **`MONGODB_URI`** can be Atlas or local MongoDB (example local: `mongodb://127.0.0.1:27017/recipe_nest`).

## Install Dependencies

From the repo root:

```bash
npm run install:all
```

## Run Locally (Development)

From the repo root:

```bash
npm run dev
```

Default URLs:
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:5173`

### Run Client Only

```bash
npm run dev --prefix client
```

### Run Server Only

```bash
npm run dev --prefix server
```

## Production

### Client build

```bash
npm run build --prefix client
```

Preview the production build locally:

```bash
npm run preview --prefix client
```

### Server start

```bash
npm run start --prefix server
```

## Seed Admin (Optional)

Run the admin seed script:

```bash
npm run seed:admin
```

If the seed script expects specific admin credentials via environment variables, add them in `server/.env` before running.

## Upload to GitHub (Proper Guidance)

### 1) Ensure secrets are not committed

- Keep `server/.env` **only locally**.
- Use `.env.example` files for documentation (already included as `server/.env.example`).

### 2) Initialize git (skip if already a repo)

```bash
git init
```

### 3) Commit your code

```bash
git add .
git commit -m "Initial commit"
```

### 4) Create a GitHub repository

Create an empty repo on GitHub (no README, no license, no gitignore — since you already have files locally).

### 5) Add remote and push

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

## Troubleshooting

- **CORS error**: confirm `CLIENT_URL` in `server/.env` matches the frontend URL exactly.
- **MongoDB error**: verify `MONGODB_URI` and MongoDB Atlas network access / credentials.
- **Port in use**: change `PORT` in `server/.env`.

