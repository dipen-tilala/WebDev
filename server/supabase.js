const initialDetails = {
  patientName: "Aarav Sharma",
  patientId: "CF-28419",
  token: "A-27",
  nowServing: "A-24",
  patientsAhead: "3",
  waitTime: "18",
  department: "General Medicine",
  doctorName: "Dr. Ananya Kapoor",
  doctorInitials: "AK",
  specialty: "General Medicine",
  room: "204",
  appointmentTime: "10:30 AM",
  location: "West Wing, Floor 2",
  appointmentId: "#AP-1072",
};

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  return { url, key };
}

async function supabaseRequest(table, query, { method = "GET", body, prefer } = {}) {
  const { url, key } = getConfig();
  const response = await fetch(`${url}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    throw Object.assign(new Error("Supabase REST request failed"), { status: response.status, table });
  }
  return response.status === 204 ? null : response.json();
}

async function ensureDashboard() {
  const rows = await supabaseRequest("dashboard_state", "?id=eq.demo&select=id,details,notifications,checked_in");
  if (rows.length) return rows[0];

  await supabaseRequest("dashboard_state", "?on_conflict=id", {
    method: "POST",
    body: [{ id: "demo", details: initialDetails, notifications: true, checked_in: false }],
    prefer: "resolution=ignore-duplicates,return=minimal",
  });
  const seededRows = await supabaseRequest("dashboard_state", "?id=eq.demo&select=id,details,notifications,checked_in");
  return seededRows[0];
}

export async function getDashboard() {
  const [row, appointments] = await Promise.all([
    ensureDashboard(),
    supabaseRequest("appointments", "?select=id,department,date:appointment_date,time:appointment_time,status&order=appointment_date.asc,created_at.asc"),
  ]);
  return {
    details: row.details,
    notifications: row.notifications,
    checkedIn: row.checked_in,
    appointments,
  };
}

export async function updateDashboard(updates) {
  const row = await ensureDashboard();
  const values = {};
  if (updates.details && typeof updates.details === "object" && !Array.isArray(updates.details)) {
    values.details = { ...row.details, ...updates.details };
  }
  if (typeof updates.notifications === "boolean") values.notifications = updates.notifications;
  if (typeof updates.checkedIn === "boolean") values.checked_in = updates.checkedIn;
  if (Object.keys(values).length) {
    await supabaseRequest("dashboard_state", "?id=eq.demo", {
      method: "PATCH",
      body: values,
      prefer: "return=minimal",
    });
  }
  return getDashboard();
}

export async function createAppointment(appointment) {
  const { department, date, time } = appointment ?? {};
  if (typeof department !== "string" || !department.trim() || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || typeof time !== "string" || !time.trim()) {
    throw new Error("Department, date, and time are required");
  }

  const rows = await supabaseRequest("appointments", "?select=id,department,date:appointment_date,time:appointment_time,status", {
    method: "POST",
    body: [{ department: department.trim(), appointment_date: date, appointment_time: time.trim(), status: "Confirmed" }],
    prefer: "return=representation",
  });
  return rows[0];
}