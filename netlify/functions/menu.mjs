import { createHash, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

const admins = {
  "harshilv3034@gmail.com": "79af2c5e77a62e26cc62203fdf8370bed6c8d63684c19e94b89fe3806021e804",
  "lotwalavaibhavi@gmail.com": "fe3a83ea5a4d23abfbcbd199a667702c8b9a1654c604b919d9b82db57a70b270",
  "lotwalavipul@gmail.com": "c116606370640008091efb42d76c62d6b9cd1d26b5fece62d5bdcc0b4276de86"
};
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
function authorized(request) {
  const email = (request.headers.get("x-admin-email") || "").trim().toLowerCase();
  const expected = admins[email];
  if (!expected) return false;
  const supplied = createHash("sha256").update(request.headers.get("x-admin-password") || "").digest("hex");
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}
export default async (request) => {
  const store = getStore("vaibhavis-kitchen-menu");
  if (request.method === "GET") return json((await store.get("menu", { type: "json" })) || { menu: null });
  if (request.method !== "PUT") return json({ error: "Method not allowed" }, 405);
  if (!authorized(request)) return json({ error: "Unauthorized" }, 401);
  try {
    const body = await request.json();
    if (!body.menu || Array.isArray(body.menu) || typeof body.menu !== "object") return json({ error: "Invalid menu" }, 400);
    await store.setJSON("menu", { menu: body.menu });
    return json({ ok: true });
  } catch { return json({ error: "Invalid request" }, 400); }
};
export const config = { path: "/api/menu" };
