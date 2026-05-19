# Gitanjali Supermart - Full-Stack Marketplace

A production-ready full-stack marketplace web application built for "Gitanjali" Supermart.

## Architecture Overview

- **Frontend**: React.js (Vite), React Router v6, Tailwind CSS, Zustand, React Hook Form + Zod
- **Backend**: Node.js 20 LTS, Express.js, Multer (memory storage), Zod Validation, Winston + Morgan Logging
- **Database & Auth & Storage**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
- **Deployment**: PM2 for backend process management, Docker, Vercel/Netlify for frontend, Railway/Render for backend.

## Local Development Setup

1. **Clone the repository**
2. **Install dependencies**:
   - Backend: `cd server && npm install`
   - Frontend: `cd client && npm install`
3. **Environment Variables**:
   - Create `.env` in the `server` directory using `server/.env.example` as a reference.
   - Create `.env` in the `client` directory using `client/.env.example` as a reference.
4. **Run the application**:
   - Backend: `npm run dev` (starts on port 5000)
   - Frontend: `npm run dev` (starts on port 5173)

## Supabase Setup

1. Create a new Supabase project.
2. Run the SQL migration from `supabase/migrations/001_init.sql` in the Supabase SQL Editor to create tables, triggers, and Row Level Security policies.
3. **Storage**: Create a new public bucket named `product-images`. Ensure the policies allow read access to the public and write access only to authenticated users or the service role.
4. **Auth**: Setup Email/Password authentication.

### Admin Account Creation

To access the `/admin` portal, create a new user via Supabase Authentication (either through the Supabase Dashboard or client SDK). Only authenticated users with a valid JWT token can access admin API routes and the portal. Ensure you secure operations for the `service_role` properly.

## Deployment Guide

### Backend (Railway/Render)
1. Use the provided `Dockerfile`.
2. Ensure you inject all the required environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ALLOWED_ORIGINS`, etc.).
3. The PM2 `ecosystem.config.js` is set up to run the application in cluster mode.

### Frontend (Vercel)
1. Link your repository to Vercel.
2. Set the build command to `npm run build` and output directory to `dist`.
3. Add the environment variables (`VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. The `vercel.json` provides the necessary rewrite rules for the SPA router to work correctly.
