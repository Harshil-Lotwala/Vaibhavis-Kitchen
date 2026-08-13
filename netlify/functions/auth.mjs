import { clearSessionCookie, createSession, readSession, sessionCookie, verifyCredentials } from "./_auth.mjs";

const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra } });

export default async request => {
  if (request.method === "GET") return json({ authenticated: Boolean(readSession(request)) });
  if (request.method === "DELETE") return json({ ok: true }, 200, { "set-cookie": clearSessionCookie });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { email = "", password = "" } = await request.json();
    if (!verifyCredentials(email, password)) return json({ error: "Incorrect email or password" }, 401);
    return json({ authenticated: true }, 200, { "set-cookie": sessionCookie(createSession(email.trim().toLowerCase())) });
  } catch { return json({ error: "Invalid request" }, 400); }
};

export const config = { path: "/api/auth" };
