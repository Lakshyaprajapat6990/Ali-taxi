import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET ?? "alitaxis-super-secret-key-2024";
const COOKIE = "alitaxis_token";

async function verifyToken(token: string): Promise<{ sub: string; role: string } | null> {
  try {
    const [header, body, sig] = token.split(".");
    if (!header || !body || !sig) return null;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = new TextEncoder().encode(`${header}.${body}`);
    const sigBytes = Uint8Array.from(atob(sig.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));

    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, data);
    if (!valid) return null;

    const payload = JSON.parse(atob(body.replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;

  // /admin/login — redirect already-logged-in admins to /admin
  if (pathname === "/admin/login" && payload?.role === "admin") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // /admin (all except /admin/login) — requires admin role
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // /dashboard — requires any logged-in user
  if (pathname.startsWith("/dashboard")) {
    if (!payload) {
      return NextResponse.redirect(new URL("/login?redirect=/dashboard", req.url));
    }
  }

  // /login — redirect already-logged-in users
  if (pathname === "/login" && payload) {
    return NextResponse.redirect(new URL(payload.role === "admin" ? "/admin" : "/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
