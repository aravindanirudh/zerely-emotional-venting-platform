# Zerely Deployment Guide

Since **Zerely** is a full-stack application (React Frontend + Node.js Backend), you need to deploy them separately.

## 1. Deploy Backend (Node.js/Express)
Vercel is optimized for Frontends. For the Backend, use **Render** or **Railway** (Both have free tiers).

### Option A: Render (Recommended for Free Tier)
1.  Push your code to GitHub.
2.  Go to [dashboard.render.com](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Root Directory**: `backend` (Important!)
6.  **Build Command**: `npm install`
7.  **Start Command**: `node server.js`
8.  **Environment Variables**:
    *   `MONGO_URI`: Your MongoDB Atlas Connection String.
    *   `JWT_SECRET`: A long random string.
    *   `FRONTEND_URL`: `https://your-project-name.vercel.app` (You will get this in Step 2).
    *   `NODE_ENV`: `production`

## 2. Deploy Frontend (Vercel)
1.  Go to [vercel.com](https://vercel.com).
2.  Click **Add New** -> **Project**.
3.  Import the same GitHub repository.
4.  **Framework Preset**: Vite
5.  **Root Directory**: Click "Edit" and select `frontend`.
6.  **Environment Variables**:
    *   `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://exhale-backend.onrender.com/api`).
7.  Click **Deploy**.

## 3. Final Connection
1.  Once Vercel finishes, copy your new Frontend URL (e.g., `https://zerely-frontend.vercel.app`).
2.  Go back to your **Backend Dashboard** (Render/Railway).
3.  Update the `FRONTEND_URL` variable with this new link.
4.  Redeploy the Backend if necessary (usually happens automatically).

## 4. Verification
- Open your Vercel URL.
- Try to **Register** or **Login**.
- If it works, your Database and Backend are connected correctly!
