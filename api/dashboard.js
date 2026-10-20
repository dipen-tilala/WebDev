import { getDashboard, updateDashboard } from "../server/supabase.js";

export default async function handler(request, response) {
  if (request.method === "GET") {
    try {
      return response.status(200).json(await getDashboard());
    } catch (error) {
      console.error("[api/dashboard GET]", { name: error.name, status: error.status, table: error.table });
      return response.status(error.message.startsWith("Missing Supabase") ? 503 : 500).json({ error: "Could not load dashboard" });
    }
  }

  if (request.method === "PATCH") {
    try {
      return response.status(200).json(await updateDashboard(request.body ?? {}));
    } catch (error) {
      console.error("[api/dashboard PATCH]", { name: error.name, status: error.status, table: error.table });
      return response.status(error.message.startsWith("Missing Supabase") ? 503 : 500).json({ error: "Could not save dashboard" });
    }
  }

  response.setHeader("Allow", "GET, PATCH");
  return response.status(405).json({ error: "Method not allowed" });
}