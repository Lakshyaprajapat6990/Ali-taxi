"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [form, setForm]       = useState({ email: "", password: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error || "Login failed"); return; }
      if (data.user?.role !== "admin") {
        setError("Access denied. Admin accounts only.");
        await fetch("/api/auth/logout", { method: "POST" });
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#fff", padding: "13px 14px 13px 44px",
    fontSize: "0.95rem", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050810", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "24px", fontFamily: "inherit",
    }}>
      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "30%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(234,179,8,0.04) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
      </div>

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <a href="/" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 60, height: 60, background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(220,38,38,0.35)",
            }}>
              <Shield size={28} color="#fff" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#eab308", letterSpacing: "0.06em" }}>ALITAXIS</p>
              <p style={{ margin: 0, fontSize: "0.62rem", color: "#6b7280", letterSpacing: "0.14em", textTransform: "uppercase" }}>Admin Portal</p>
            </div>
          </a>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(10,15,28,0.97)", border: "1px solid rgba(220,38,38,0.2)",
          borderRadius: 20, padding: "40px 36px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(220,38,38,0.08)",
        }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: 20, padding: "4px 12px", marginBottom: 16,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#dc2626" }} />
              <span style={{ fontSize: "0.72rem", color: "#f87171", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Restricted Access</span>
            </div>
            <h2 style={{ margin: "0 0 6px", fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Admin Sign In
            </h2>
            <p style={{ margin: 0, color: "#4b5563", fontSize: "0.88rem" }}>
              This portal is for authorized administrators only
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 10, padding: "12px 14px", marginBottom: 20,
            }}>
              <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, color: "#f87171", fontSize: "0.85rem" }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#6b7280", fontWeight: 600, marginBottom: 6, letterSpacing: "0.04em" }}>
                ADMIN EMAIL
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }} />
                <input
                  required type="email" value={form.email} onChange={set("email")}
                  placeholder="admin@alitaxis.com" style={inp}
                  onFocus={e => e.currentTarget.style.borderColor = "#dc2626"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#6b7280", fontWeight: 600, marginBottom: 6, letterSpacing: "0.04em" }}>
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }} />
                <input
                  required type={showPw ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="Enter admin password" style={{ ...inp, paddingRight: 46 }}
                  onFocus={e => e.currentTarget.style.borderColor = "#dc2626"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#4b5563", padding: 2,
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%",
              background: loading ? "#7f1d1d" : "linear-gradient(135deg, #dc2626, #b91c1c)",
              color: "#fff", fontWeight: 800, border: "none", borderRadius: 12,
              padding: "14px", cursor: loading ? "not-allowed" : "pointer",
              fontSize: "0.95rem", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8, transition: "opacity 0.2s",
              marginTop: 8, boxShadow: loading ? "none" : "0 4px 16px rgba(220,38,38,0.35)",
            }}>
              {loading ? "Authenticating…" : "Access Admin Panel"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div style={{
            marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <a href="/" style={{ color: "#4b5563", textDecoration: "none", fontSize: "0.82rem" }}>
              ← Back to website
            </a>
            <a href="/login" style={{ color: "#6b7280", textDecoration: "none", fontSize: "0.82rem" }}>
              Customer login →
            </a>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.75rem", color: "#1f2937" }}>
          Unauthorized access attempts are logged and monitored
        </p>
      </div>
    </div>
  );
}
