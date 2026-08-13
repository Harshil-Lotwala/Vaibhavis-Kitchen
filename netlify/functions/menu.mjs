import { getStore } from "@netlify/blobs";
import { readSession } from "./_auth.mjs";
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
export default async (request) => {
  const store = getStore("vaibhavis-kitchen-menu");
  if (request.method === "GET") return json((await store.get("menu", { type: "json" })) || { menu: null });
  if (request.method !== "PUT") return json({ error: "Method not allowed" }, 405);
  if (!readSession(request)) return json({ error: "Unauthorized" }, 401);
  try {
    const body = await request.json();
    if (!body.menu || Array.isArray(body.menu) || typeof body.menu !== "object") return json({ error: "Invalid menu" }, 400);
    await store.setJSON("menu", { menu: body.menu });
    return json({ ok: true });
  } catch { return json({ error: "Invalid request" }, 400); }
};
export const config = { path: "/api/menu" };
