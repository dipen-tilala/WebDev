import { createAppointment } from "../server/supabase.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const appointment = await createAppointment(request.body ?? {});
    return response.status(201).json(appointment);
  } catch (error) {
    if (error.message.startsWith("Missing Supabase")) {
      return response.status(503).json({ error: "Supabase is not configured" });
    }
    if (error.message === "Department, date, and time are required") {
      return response.status(400).json({ error: error.message });
    }
    console.error("[api/appointments POST]", { name: error.name, status: error.status, table: error.table });
    return response.status(500).json({ error: "Could not create appointment" });
  }
}