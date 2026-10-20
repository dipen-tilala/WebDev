import { createServer } from "node:http";
import { createAppointment, getDashboard, updateDashboard } from "./supabase.js";

const port = Number(process.env.API_PORT || 3001);

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 100_000) throw new Error("Request body is too large");
  }
  return body ? JSON.parse(body) : {};
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

  try {
    if (pathname === "/api/health" && request.method === "GET") {
      const config = {
        urlConfigured: Boolean(process.env.SUPABASE_URL),
        serviceKeyConfigured: Boolean(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY),
      };
      try {
        await getDashboard();
        return sendJson(response, 200, { status: "ok", database: "connected", ...config });
      } catch (error) {
        console.error("[api/health]", { name: error.name, status: error.status, table: error.table });
        return sendJson(response, 503, {
          status: "error",
          database: error.status ? `request failed (${error.status})` : "unavailable",
          ...config,
        });
      }
    }
    if (pathname === "/api/dashboard" && request.method === "GET") {
      return sendJson(response, 200, await getDashboard());
    }
    if (pathname === "/api/dashboard" && request.method === "PATCH") {
      return sendJson(response, 200, await updateDashboard(await readBody(request)));
    }
    if (pathname === "/api/appointments" && request.method === "POST") {
      return sendJson(response, 201, await createAppointment(await readBody(request)));
    }
    return sendJson(response, 404, { error: "Not found" });
  } catch (error) {
    const status = error instanceof SyntaxError || error.message === "Request body is too large" ? 400 : error.message.startsWith("Missing Supabase") ? 503 : 500;
    return sendJson(response, status, { error: status === 400 ? "Invalid request body" : status === 503 ? error.message : "Internal server error" });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`CareFlow API listening on http://127.0.0.1:${port}`);
});
