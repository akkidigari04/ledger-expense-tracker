# Deployment Guide

## Backend → Render (free tier)

### 1. Create a Render account
Go to https://render.com and sign up with GitHub.

### 2. New Web Service
- Click **New → Web Service**
- Connect your GitHub repository
- Set **Root Directory** to `server`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### 3. Environment Variables (Render dashboard → Environment tab)
| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://your-app.vercel.app` *(fill in after Vercel deploy)* |
| `PORT` | *(leave blank — Render sets this automatically)* |

### 4. Persistent disk (for SQLite)
- Go to **Disks** tab → **Add Disk**
- Mount path: `/data`
- Set `DB_PATH=/data/expenses.db` in Environment Variables

### 5. Deploy
Click **Create Web Service**. Render will build and deploy automatically on every push to `main`.

Your backend URL will be: `https://ledger-api.onrender.com`

> ⚠️ Free tier spins down after 15 min of inactivity. First request after sleep takes ~30s.

---

## Frontend → Vercel (free tier)

### 1. Create a Vercel account
Go to https://vercel.com and sign up with GitHub.

### 2. Import repository
- Click **Add New → Project**
- Import your GitHub repo
- Set **Root Directory** to `client`
- Framework preset: **Vite**

### 3. Environment Variables (Vercel dashboard → Settings → Environment Variables)
| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://ledger-api.onrender.com/api` |

### 4. Deploy
Click **Deploy**. Vercel builds `npm run build` and serves the `dist/` folder.

Your frontend URL will be: `https://ledger-expense-tracker.vercel.app`

### 5. Update Render's CLIENT_URL
Go back to Render → Environment Variables and set `CLIENT_URL` to your Vercel URL.
Trigger a redeploy.

---

## Smoke test checklist

After deployment, open an **incognito window** and verify:

- [ ] App loads at Vercel URL
- [ ] `/api/health` returns `{"status":"ok"}` at Render URL
- [ ] Adding an expense works (no CORS errors in devtools)
- [ ] Refreshing the page retains data (SQLite persists)
- [ ] Charts render with data
- [ ] CSV export downloads a file

---

## Local production build test

```bash
# Build the frontend
npm run build --prefix client

# Preview the built output
npm run preview --prefix client   # serves on http://localhost:4173

# Run server in production mode
NODE_ENV=production npm start --prefix server
```
