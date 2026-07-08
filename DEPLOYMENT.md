# Deployment Guide

This guide explains how to deploy Aivenky Nova to production.

## 1. Backend Deployment (Render)

Render is a great platform for deploying the Express backend.

1.  **Create a MongoDB Atlas Cluster**:
    *   Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    *   Create a free cluster.
    *   Add a database user and allow access from anywhere (`0.0.0.0/0`).
    *   Get your connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.abc.mongodb.net/aivenky`).

2.  **Deploy to Render**:
    *   Create a new **Web Service** on Render.
    *   Connect your GitHub repository.
    *   Root Directory: `backend`
    *   Build Command: `npm install && npm run build`
    *   Start Command: `npm start`
    *   **Environment Variables**:
        *   `MONGODB_URI`: Your MongoDB Atlas connection string.
        *   `JWT_SECRET`: A long, random string.
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
| **Render** | `MONGODB_URI` | Database connection |
| **Render** | `GEMINI_API_KEY` | AI Research Engine |
| **Render** | `JWT_SECRET` | Authentication security |
| **Vercel** | `vercel.json` | API Routing |
