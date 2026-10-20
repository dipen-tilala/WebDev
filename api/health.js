import { getDashboard } from "../server/supabase.js";

export default async function handler(_request, response) {
  const config = {
    urlConfigured: Boolean(process.env.SUPABASE_URL),
    serviceKeyConfigured: Boolean(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY),
  };

  try {
    await getDashboard();
    return response.status(200).json({ status: "ok", database: "connected", ...config });
  } catch (error) {
    console.error("[api/health]", { name: error.name, status: error.status, table: error.table });
    return response.status(error.message.startsWith("Missing Supabase") ? 503 : 503).json({
      status: "error",
      database: error.status ? `request failed (${error.status})` : "unavailable",
      ...config,
    });
  }
}