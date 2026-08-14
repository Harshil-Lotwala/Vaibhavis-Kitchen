import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

const cookieName = "vk_admin_session";
const encode = value => Buffer.from(value).toString("base64url");
const sign = value => createHmac("sha256", process.env.SESSION_SECRET || "").update(value).digest("base64url");

function configuredAdmins() {
  let admins;
  try { admins = JSON.parse(process.env.ADMIN_CREDENTIALS || "{}"); } catch { admins = {}; }
  return admins;
}

async function passwordRecords() {
  const overrides = await getStore("vaibhavis-kitchen-security").get("passwords", { type: "json" });
  return { ...configuredAdmins(), ...(overrides || {}) };
}

export async function verifyCredentials(email, password) {
  const record = (await passwordRecords())[email.trim().toLowerCase()];
  if (!record?.salt || !record?.hash || !password) return false;
  const actual = scryptSync(password, record.salt, 64);
  const expected = Buffer.from(record.hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function changePassword(email, password) {
  const normalized = email.trim().toLowerCase();
  const store = getStore("vaibhavis-kitchen-security");
  const overrides = (await store.get("passwords", { type: "json" })) || {};
  const salt = randomBytes(24).toString("hex");
  overrides[normalized] = { salt, hash: scryptSync(password, salt, 64).toString("hex") };
  await store.setJSON("passwords", overrides);
}

export function createSession(email) {
  if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not configured");
  const payload = encode(JSON.stringify({ email, expires: Date.now() + 8 * 60 * 60 * 1000, nonce: randomBytes(12).toString("hex") }));
  return `${payload}.${sign(payload)}`;
}

export function readSession(request) {
  if (!process.env.SESSION_SECRET) return null;
  const raw = (request.headers.get("cookie") || "").split(";").map(v => v.trim()).find(v => v.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try { const session = JSON.parse(Buffer.from(payload, "base64url").toString()); return session.expires > Date.now() ? session : null; } catch { return null; }
}

export const sessionCookie = token => `${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`;
export const clearSessionCookie = `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
