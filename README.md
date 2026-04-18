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

## Login Page
<img width="1908" height="974" alt="image" src="https://github.com/user-attachments/assets/efd3b463-c92c-4ed0-a804-3e914e631e00" />

## Sign Up page
<img width="1903" height="973" alt="image" src="https://github.com/user-attachments/assets/3ac3268a-9f15-44c2-b74c-5da82293a4c2" />

## User (FoodLover) Dashboard
<img width="1890" height="955" alt="image" src="https://github.com/user-attachments/assets/8a1de895-25c1-435f-9d73-48436aca79c8" />

<img width="1883" height="949" alt="image" src="https://github.com/user-attachments/assets/3396dbd0-7177-40f9-9ec2-275db6970844" />

## Chef Dashboard
<img width="1878" height="953" alt="image" src="https://github.com/user-attachments/assets/a5ee240b-f884-42fb-aa6e-d2b88e1251d7" />

<img width="1877" height="947" alt="image" src="https://github.com/user-attachments/assets/41bb38bd-d5d1-45f9-a3cb-d842ef94ac1f" />

## Admin Dashboard
<img width="1882" height="944" alt="image" src="https://github.com/user-attachments/assets/75e9592a-83ec-42ed-9d38-ab76b1ddbc2e" />


## Troubleshooting

- **CORS error**: confirm `CLIENT_URL` in `server/.env` matches the frontend URL exactly.
- **MongoDB error**: verify `MONGODB_URI` and MongoDB Atlas network access / credentials.
- **Port in use**: change `PORT` in `server/.env`.

