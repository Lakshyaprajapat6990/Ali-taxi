"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plane, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, AlertCircle } from "lucide-react";

function LoginForm() {
  const router   = useRouter();
  const params   = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [mode, setMode]       = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [form, setForm]       = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && form.password !== form.confirmPassword) {
      setError("Passwords do not match"); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters"); return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, phone: form.phone, password: form.password };

      const res  = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error || "Something went wrong"); return; }

      router.push(data.user?.role === "admin" ? "/admin" : redirect);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#fff", padding: "12px 14px 12px 42px",
    fontSize: "0.95rem", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s",
  };

  return (
    <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <a href="/" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 52, height: 52, background: "#eab308", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plane size={26} color="#000" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#eab308", letterSpacing: "0.06em" }}>ALITAXIS</p>
            <p style={{ margin: 0, fontSize: "0.65rem", color: "#4b5563", letterSpacing: "0.12em" }}>NORWICH</p>
          </div>
        </a>
      </div>

      {/* Card */}
      <div style={{
        background: "rgba(10,15,28,0.95)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "36px 32px", boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Tab toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
          {(["login", "register"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
              flex: 1, padding: "9px", border: "none", borderRadius: 8, cursor: "pointer",
              background: mode === m ? "#eab308" : "none",
              color: mode === m ? "#000" : "#6b7280",
              fontWeight: 700, fontSize: "0.88rem", transition: "all 0.2s",
            }}>
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <h2 style={{ margin: "0 0 6px", fontSize: "1.4rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p style={{ margin: "0 0 24px", color: "#4b5563", fontSize: "0.88rem" }}>
          {mode === "login" ? "Sign in to track your bookings" : "Book taxis and track your journeys"}
        </p>

        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10, padding: "12px 14px", marginBottom: 18,
          }}>
            <AlertCircle size={16} color="#f87171" />
            <p style={{ margin: 0, color: "#f87171", fontSize: "0.85rem" }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "register" && (
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }} />
              <input required value={form.name} onChange={set("name")} placeholder="Full name" style={inp}
                onFocus={e => e.currentTarget.style.borderColor = "#eab308"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
          )}

          <div style={{ position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }} />
            <input required type="email" value={form.email} onChange={set("email")} placeholder="Email address" style={inp}
              onFocus={e => e.currentTarget.style.borderColor = "#eab308"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
          </div>

          {mode === "register" && (
            <div style={{ position: "relative" }}>
              <Phone size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }} />
              <input value={form.phone} onChange={set("phone")} placeholder="Phone number (optional)" style={inp}
                onFocus={e => e.currentTarget.style.borderColor = "#eab308"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
          )}

          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }} />
            <input required type={showPw ? "text" : "password"} value={form.password} onChange={set("password")}
              placeholder="Password" style={{ ...inp, paddingRight: 44 }}
              onFocus={e => e.currentTarget.style.borderColor = "#eab308"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: "#4b5563", padding: 2,
            }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {mode === "register" && (
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }} />
              <input required type={showPw ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")}
                placeholder="Confirm password" style={inp}
                onFocus={e => e.currentTarget.style.borderColor = "#eab308"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", background: loading ? "#92701a" : "#eab308", color: "#000",
            fontWeight: 800, border: "none", borderRadius: 12, padding: "14px",
            cursor: loading ? "not-allowed" : "pointer", fontSize: "0.95rem",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "background 0.2s", marginTop: 4,
          }}>
            {loading ? "Please wait…" : (mode === "login" ? "Sign In" : "Create Account")}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.82rem", color: "#374151" }}>
          <a href="/" style={{ color: "#6b7280", textDecoration: "none" }}>← Back to AliTaxis website</a>
        </p>
        <p style={{ textAlign: "center", marginTop: 8, fontSize: "0.82rem", color: "#374151" }}>
          <a href="/admin/login" style={{ color: "#4b5563", textDecoration: "none" }}>Admin? Sign in here →</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh", background: "#050810", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "24px", fontFamily: "inherit",
    }}>
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>
      <Suspense fallback={
        <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Loading…</div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
