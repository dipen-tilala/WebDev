# Supabase setup

1. Create a Supabase project and open its SQL Editor.
2. Run the SQL in `supabase/schema.sql`.
3. In the project API settings, copy the Project URL and the `service_role` key.
4. Add these environment variables to the Vercel project for Production and Preview deployments:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. For local development, copy `.env.example` to `.env` and fill in those values. Keep `.env` out of Git.
6. Run `npm run dev` and `npm run dev:api` in separate terminals. The Vite proxy sends `/api` requests to the local API; Vercel serves the same routes from `api/` after deployment.

The service-role key bypasses Supabase Row Level Security. It is only read by server-side code; never add it to a `VITE_` variable or browser code. The schema enables Row Level Security without public policies and grants table access only to `service_role`.

This prototype uses a single shared demo dashboard and does not include sign-in or per-patient authorization. Keep real patient data out of it until authentication, authorization, and applicable privacy requirements are implemented.