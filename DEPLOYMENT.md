# Deployment Guide

This guide explains how to deploy InvestIQ to production using **Aiven** as the MySQL database host and **Render** for the backend.

---

## 💾 1. Database Setup (Aiven)

[Aiven](https://aiven.io/) provides a reliable cloud MySQL database with a free tier.

1. **Sign Up & Create Service**:
   * Go to [Aiven Console](https://console.aiven.io/) and create an account.
   * Click **Create service**.
   * Select **MySQL** as the database service.
   * Choose the **Free** plan tier.
   * Choose your cloud provider region (e.g. AWS or GCP close to your target audience).
   * Enter a service name (e.g., `investiq-db`) and click **Create service**.

2. **Get Connection Details**:
   * Wait a few minutes for the service status to change from *Rebuilding* to *Running*.
   * In the **Overview** tab under **Connection information**, copy the following values:
     * **Host** (e.g., `mysql-3c1234a-yourorg-f12a.aivencloud.com`)
     * **Port** (e.g., `12345`)
     * **User** (typically `avnadmin`)
     * **Password** (click *Show* to reveal and copy the secure password)
     * **Database Name** (typically `defaultdb`)

---

## 🚀 2. Backend Deployment (Render)

Render is used to deploy the Express backend.

1. **Create Web Service**:
   * Log into your [Render Console](https://dashboard.render.com/).
   * Click **New +** and select **Web Service**.
   * Connect your GitHub repository.
   * Configure the service settings:
     * **Name**: `investiq-backend`
     * **Root Directory**: `backend`
     * **Runtime**: `Node`
     * **Build Command**: `npm install && npm run build`
     * **Start Command**: `npm start`

2. **Configure Environment Variables**:
   Under the **Environment** tab, add the following variables using your connection details from Aiven:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `MYSQL_HOST` | `mysql-3c1234a-yourorg-f12a.aivencloud.com` | Copy from Aiven Connection Details |
   | `MYSQL_PORT` | `12345` | Copy from Aiven Connection Details |
   | `MYSQL_USER` | `avnadmin` | Copy from Aiven Connection Details |
   | `MYSQL_PASSWORD` | `your_aiven_password_here` | Copy from Aiven Connection Details |
   | `MYSQL_DATABASE` | `defaultdb` | Default database created by Aiven |
   | `GEMINI_API_KEY` | `your_google_gemini_api_key_here` | Your AI research key |
   | `JWT_SECRET` | `your_strong_random_jwt_secret` | Random security string for auth tokens |
   | `PORT` | `5010` | Port the backend will listen on |

3. **Deploy & Grab URL**:
   * Click **Create Web Service**.
   * Render will build and start the server. Once successfully deployed, copy your backend URL (e.g., `https://investiq-backend.onrender.com`).

---

## 🌐 3. Frontend Deployment (Vercel)

Vercel is used to deploy the React frontend.

1. **Update `frontend/vercel.json`**:
   Ensure the `destination` for `/api/(.*)` points to your newly deployed Render backend URL:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://investiq-backend.onrender.com/api/$1" },
       { "source": "/((?!api/).*)", "destination": "/index.html" }
     ]
   }
   ```

2. **Deploy to Vercel**:
   * Go to [Vercel](https://vercel.com).
   * Create a new project and import your GitHub repository.
   * Set **Root Directory** to `frontend`.
   * Set **Framework Preset** to `Vite`.
   * Click **Deploy**. Vercel handles routing and bypasses CORS automatically through the proxy rules in `vercel.json`.
