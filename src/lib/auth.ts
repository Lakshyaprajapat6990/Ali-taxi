import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { connectDB } from "./mongodb";
import User from "@/models/User";

const SECRET = process.env.JWT_SECRET ?? "alitaxis-super-secret-key-2024";
const COOKIE = "alitaxis_token";

/* ── JWT-like token: base64url header.payload.signature ── */
function sign(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256" })).toString("base64url");
  const body   = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig    = createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

function verify(token: string): Record<string, unknown> | null {
  try {
    const [header, body, sig] = token.split(".");
    const expected = createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url");
    const a = Buffer.from(sig, "base64url");
    const b = Buffer.from(expected, "base64url");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/* ── Password hashing using PBKDF2 / HMAC-SHA256 ── */
export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac("sha256", salt).update(plain).digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const attempt = createHmac("sha256", salt).update(plain).digest("hex");
  return attempt === hash;
}

/* ── Token / cookie helpers ── */
export function createToken(userId: string, role: string): string {
  return sign({ sub: userId, role, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
}

export async function setAuthCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.set(COOKIE, "", { maxAge: 0, path: "/" });
}

/* ── Get current session from cookie ── */
export async function getSession(): Promise<{
  id: string; name: string; email: string; phone?: string; role: string;
} | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const payload = verify(token);
  if (!payload || typeof payload.sub !== "string") return null;

  await connectDB();
  const user = await User.findById(payload.sub).select("name email phone role").lean() as any;
  if (!user) return null;

  return {
    id:    user._id.toString(),
    name:  user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    role:  user.role,
  };
}
