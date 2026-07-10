# Deployment Guide

This guide explains how to deploy InvestIQ to production using MySQL as the database.

## 1. Backend Deployment (Render)

Render is a great platform for deploying the Express backend.

1.  **Set up a Hosted MySQL Instance**:
    *   Create a MySQL database on a hosting provider (e.g., [Aiven](https://aiven.io/), [Tidb Cloud](https://www.pingcap.com/tidb-cloud/), [AWS RDS](https://aws.amazon.com/rds/), or Render's PostgreSQL/MySQL setup).
    *   Create a database named `investiq`.
    *   Obtain the connection parameters (Host, Port, User, Password, Database Name).

2.  **Deploy to Render**:
    *   Create a new **Web Service** on Render.
    *   Connect your GitHub repository.
    *   Root Directory: `backend`
    *   Build Command: `npm install && npm run build`
    *   Start Command: `npm start`
    *   **Environment Variables**:
        *   `MYSQL_DATABASE`: Name of the database (e.g., `investiq`).
        *   `MYSQL_USER`: The MySQL username.
        *   `MYSQL_PASSWORD`: The MySQL password.
        *   `MYSQL_HOST`: Host address of the database.
        *   `MYSQL_PORT`: `3306` (or database port).
        *   `JWT_SECRET`: A long, random security string.
        *   `GEMINI_API_KEY`: Your Google Gemini API key.
        *   `PORT`: `5010` (or whatever you prefer).

3.  **Get your Backend URL**: Once deployed, Render will give you a URL like `https://aiven-backend.onrender.com`.

---

## 2. Frontend Deployment (Vercel)

Vercel is the best platform for React/Vite applications.

1.  **Update `frontend/vercel.json`**:
    Ensure the `destination` for `/api/(.*)` points to your Render backend URL.
    ```json
    {
      "rewrites": [
        { "source": "/api/(.*)", "destination": "https://your-backend-url.onrender.com/api/$1" },
        { "source": "/((?!api/).*)", "destination": "/index.html" }
      ]
    }
    ```

2.  **Deploy to Vercel**:
    *   Go to [Vercel](https://vercel.com).
    *   Create a new project and connect your GitHub repository.
    *   Root Directory: `frontend`
    *   Framework Preset: `Vite`
    *   **Environment Variables**:
        *   `VITE_API_TARGET`: Your backend URL (optional, but good for local dev).

---

## 3. Environment Summary

| Platform | Variable | Purpose |
| :--- | :--- | :--- |
| **Render** | `MYSQL_DATABASE` | Database Name |
| **Render** | `MYSQL_USER` | Database User |
| **Render** | `MYSQL_PASSWORD` | Database Password |
| **Render** | `MYSQL_HOST` | Database Hostname |
| **Render** | `MYSQL_PORT` | Database Port (default 3306) |
| **Render** | `GEMINI_API_KEY` | AI Research Engine |
| **Render** | `JWT_SECRET` | Authentication security |
| **Vercel** | `vercel.json` | API Routing |
