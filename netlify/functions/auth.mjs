import { changePassword, clearSessionCookie, createSession, readSession, sessionCookie, verifyCredentials } from "./_auth.mjs";

const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra } });

export default async request => {
  if (request.method === "GET") return json({ authenticated: Boolean(readSession(request)) });
  if (request.method === "DELETE") return json({ ok: true }, 200, { "set-cookie": clearSessionCookie });
  if (request.method === "PATCH") {
    const session = readSession(request);
    if (!session) return json({ error: "Unauthorized" }, 401);
    try {
      const { currentPassword = "", newPassword = "" } = await request.json();
      if (!(await verifyCredentials(session.email, currentPassword))) return json({ error: "Current password is incorrect" }, 401);
      if (newPassword.length < 12 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) return json({ error: "Use 12+ characters with uppercase, lowercase, a number and a symbol" }, 400);
      if (newPassword === currentPassword) return json({ error: "New password must be different" }, 400);
      await changePassword(session.email, newPassword);
      return json({ ok: true }, 200, { "set-cookie": clearSessionCookie });
    } catch { return json({ error: "Invalid request" }, 400); }
  }
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { email = "", password = "" } = await request.json();
    if (!(await verifyCredentials(email, password))) return json({ error: "Incorrect email or password" }, 401);
    return json({ authenticated: true }, 200, { "set-cookie": sessionCookie(createSession(email.trim().toLowerCase())) });
  } catch { return json({ error: "Invalid request" }, 400); }
};

export const config = { path: "/api/auth" };
