"use client";

import { useState, useEffect } from "react";
import {
  Plane, MapPin, Calendar, Clock, Users, Luggage,
  CheckCircle, AlertCircle, XCircle, LogOut, ArrowRight,
  Navigation, Phone, Mail, RefreshCw, Plus,
} from "lucide-react";

interface Booking {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  luggage: number;
  vehicleType: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  price: number;
  status: string;
  locationLat?: number;
  locationLng?: number;
  locationAddress?: string;
  createdAt: string;
  driverName?: string;
  driverPhone?: string;
  taxiNumber?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const STATUS_META: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  pending:   { icon: <AlertCircle size={14} />,  color: "#eab308", bg: "rgba(234,179,8,0.1)",  label: "Pending Review" },
  confirmed: { icon: <CheckCircle size={14} />,  color: "#60a5fa", bg: "rgba(59,130,246,0.1)", label: "Confirmed" },
  completed: { icon: <CheckCircle size={14} />,  color: "#4ade80", bg: "rgba(34,197,94,0.1)",  label: "Completed" },
  cancelled: { icon: <XCircle size={14} />,      color: "#f87171", bg: "rgba(239,68,68,0.1)",  label: "Cancelled" },
};

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

export default function UserDashboard() {
  const [user, setUser]         = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then(r => r.json()),
      fetch("/api/bookings").then(r => r.json()),
    ]).then(([meData, bData]) => {
      setUser(meData.user);
      setBookings(Array.isArray(bData) ? bData : []);
    }).finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const stats = {
    total:     bookings.length,
    active:    bookings.filter(b => ["pending","confirmed"].includes(b.status)).length,
    completed: bookings.filter(b => b.status === "completed").length,
    spent:     bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.price, 0),
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050810", color: "#fff", fontFamily: "inherit" }}>

      {/* ── Top nav ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(5,8,16,0.95)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 2rem", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "#eab308", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plane size={18} color="#000" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 800, color: "#eab308", letterSpacing: "0.05em" }}>ALITAXIS</p>
            <p style={{ margin: 0, fontSize: "0.55rem", color: "#374151", letterSpacing: "0.1em" }}>NORWICH</p>
          </div>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(234,179,8,0.15)", border: "1.5px solid #eab308", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", color: "#eab308" }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{user.name}</p>
                <p style={{ margin: 0, fontSize: "0.7rem", color: "#4b5563" }}>{user.email}</p>
              </div>
            </div>
          )}
          <a href="/" style={{ color: "#6b7280", fontSize: "0.82rem", textDecoration: "none", padding: "6px 12px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}>Home</a>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#f87171", fontSize: "0.82rem", padding: "6px 12px", cursor: "pointer" }}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </header>

      <main style={{ paddingTop: 88, maxWidth: 1100, margin: "0 auto", padding: "88px 24px 60px" }}>

        {/* Welcome */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Welcome back, <span style={{ color: "#eab308" }}>{user?.name?.split(" ")[0] ?? "there"}</span> 👋
          </h1>
          <p style={{ margin: 0, color: "#4b5563", fontSize: "0.95rem" }}>Here are all your taxi bookings and journey details.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Bookings", value: stats.total,     color: "#fff"    },
            { label: "Active",         value: stats.active,    color: "#60a5fa" },
            { label: "Completed",      value: stats.completed, color: "#4ade80" },
            { label: "Total Spent",    value: `£${stats.spent}`, color: "#eab308" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(10,15,28,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 20px" }}>
              <p style={{ margin: "0 0 8px", fontSize: "0.72rem", color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Book CTA */}
        <a href="/#book" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(234,179,8,0.07)", border: "1px solid rgba(234,179,8,0.2)",
          borderRadius: 14, padding: "16px 22px", marginBottom: 28, textDecoration: "none",
          transition: "background 0.2s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Plus size={18} color="#eab308" />
            <div>
              <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#eab308" }}>Book a New Taxi</p>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#6b7280" }}>Your details will be pre-filled automatically</p>
            </div>
          </div>
          <ArrowRight size={18} color="#eab308" />
        </a>

        {/* Bookings list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#374151" }}>
            <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", marginBottom: 12 }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ margin: 0 }}>Loading your bookings…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "rgba(10,15,28,0.6)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16 }}>
            <Plane size={40} color="#1f2937" style={{ marginBottom: 16 }} />
            <p style={{ margin: "0 0 8px", fontSize: "1.1rem", fontWeight: 700, color: "#374151" }}>No bookings yet</p>
            <p style={{ margin: "0 0 20px", color: "#1f2937", fontSize: "0.88rem" }}>Your bookings will appear here once you make one.</p>
            <a href="/" style={{ background: "#eab308", color: "#000", fontWeight: 700, padding: "12px 28px", borderRadius: 10, textDecoration: "none", fontSize: "0.9rem" }}>
              Book Your First Taxi
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {bookings.map(b => {
              const sm = STATUS_META[b.status] ?? STATUS_META.pending;
              return (
                <div key={b.id} style={{
                  background: "rgba(10,15,28,0.9)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16, padding: "20px 24px",
                  display: "grid", gridTemplateColumns: "1fr 1fr auto",
                  gap: 20, alignItems: "center",
                  transition: "border-color 0.2s",
                  cursor: "pointer",
                }}
                  onClick={() => setSelected(b)}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(234,179,8,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                >
                  {/* Journey */}
                  <div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                      <MapPin size={13} color="#4ade80" style={{ marginTop: 3, flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#d1d5db", lineHeight: 1.4 }}>{b.pickupLocation}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <MapPin size={13} color="#f87171" style={{ marginTop: 3, flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#d1d5db", lineHeight: 1.4 }}>{b.dropoffLocation}</p>
                    </div>
                    {b.locationAddress && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                        <Navigation size={11} color="#eab308" />
                        <p style={{ margin: 0, fontSize: "0.72rem", color: "#4b5563" }}>Live location: {b.locationAddress.slice(0, 50)}…</p>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "#6b7280" }}>
                      <Calendar size={12} color="#eab308" />{b.pickupDate}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "#6b7280" }}>
                      <Clock size={12} color="#eab308" />{b.pickupTime}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "#6b7280" }}>
                      <Users size={12} color="#eab308" />{b.passengers} pax
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 5 }}>
                      {cap(b.vehicleType)}
                    </span>
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: "#eab308" }}>£{b.price}</span>
                  </div>

                  {/* Status */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: sm.bg, color: sm.color,
                      padding: "5px 12px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700,
                    }}>
                      {sm.icon}{sm.label}
                    </span>
                    <p style={{ margin: 0, fontSize: "0.7rem", color: "#374151" }}>{formatDate(b.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Booking detail modal ── */}
      {selected && (
        <div onClick={e => e.target === e.currentTarget && setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", padding: "32px 28px", position: "relative" }}>
            <button onClick={() => setSelected(null)} style={{ position: "absolute", top: 18, right: 18, background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, color: "#6b7280", cursor: "pointer", padding: "6px 10px", fontSize: "1rem" }}>✕</button>

            <h2 style={{ margin: "0 0 4px", fontSize: "1.2rem", fontWeight: 800 }}>Booking Details</h2>
            <p style={{ margin: "0 0 20px", color: "#374151", fontSize: "0.78rem" }}>Ref: #{selected.id.slice(-8).toUpperCase()}</p>

            {/* Status */}
            {(() => { const sm = STATUS_META[selected.status] ?? STATUS_META.pending; return (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: sm.bg, border: `1px solid ${sm.color}30`, borderRadius: 10, padding: "10px 14px", marginBottom: 20 }}>
                <span style={{ color: sm.color }}>{sm.icon}</span>
                <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, color: sm.color }}>{sm.label}</p>
              </div>
            ); })()}

            {/* Journey */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: "0 0 10px", fontSize: "0.7rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em" }}>Journey</p>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
                {[
                  { icon: <MapPin size={13} color="#4ade80" />, label: "From",    value: selected.pickupLocation },
                  { icon: <MapPin size={13} color="#f87171" />, label: "To",      value: selected.dropoffLocation },
                  { icon: <Calendar size={13} color="#eab308" />, label: "Date",  value: selected.pickupDate },
                  { icon: <Clock size={13} color="#eab308" />,    label: "Time",  value: selected.pickupTime },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    {row.icon}
                    <span style={{ fontSize: "0.75rem", color: "#374151", width: 50 }}>{row.label}</span>
                    <span style={{ fontSize: "0.88rem", color: "#d1d5db" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live location */}
            {selected.locationLat && selected.locationLng && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ margin: "0 0 10px", fontSize: "0.7rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em" }}>Your Live Location at Booking</p>
                <div style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                    <Navigation size={14} color="#eab308" style={{ marginTop: 2 }} />
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#d1d5db", lineHeight: 1.5 }}>{selected.locationAddress}</p>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "#4b5563" }}>Lat: {selected.locationLat?.toFixed(5)} · Lng: {selected.locationLng?.toFixed(5)}</p>
                  <a href={`https://www.google.com/maps?q=${selected.locationLat},${selected.locationLng}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 10, color: "#eab308", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>
                    <MapPin size={12} /> Open in Google Maps
                  </a>
                </div>
              </div>
            )}

            {/* Vehicle & price */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px" }}>
                <p style={{ margin: "0 0 4px", fontSize: "0.7rem", color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em" }}>Vehicle</p>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>{cap(selected.vehicleType)}</p>
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#4b5563", display: "flex", gap: 10 }}>
                  <span><Users size={10} /> {selected.passengers} pax</span>
                  <span><Luggage size={10} /> {selected.luggage} bags</span>
                </p>
              </div>
              <div style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: 12, padding: "14px 16px" }}>
                <p style={{ margin: "0 0 4px", fontSize: "0.7rem", color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em" }}>Price</p>
                <p style={{ margin: 0, fontWeight: 800, fontSize: "1.4rem", color: "#eab308", letterSpacing: "-0.02em" }}>£{selected.price}</p>
              </div>
            </div>

            {selected.specialRequests && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ margin: "0 0 10px", fontSize: "0.7rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em" }}>Special Requests</p>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 16px" }}>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#9ca3af", lineHeight: 1.6 }}>{selected.specialRequests}</p>
                </div>
              </div>
            )}

            {/* Driver details — shown when assigned */}
            {(selected.driverName || selected.driverPhone || selected.taxiNumber) ? (
              <div style={{ marginBottom: 16 }}>
                <p style={{ margin: "0 0 10px", fontSize: "0.7rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em" }}>Your Driver</p>
                <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    {selected.driverName && (
                      <div>
                        <p style={{ margin: "0 0 4px", fontSize: "0.68rem", color: "#4b5563", textTransform: "uppercase", fontWeight: 700 }}>Driver Name</p>
                        <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{selected.driverName}</p>
                      </div>
                    )}
                    {selected.driverPhone && (
                      <div>
                        <p style={{ margin: "0 0 4px", fontSize: "0.68rem", color: "#4b5563", textTransform: "uppercase", fontWeight: 700 }}>Driver Phone</p>
                        <a href={`tel:${selected.driverPhone}`} style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#60a5fa", textDecoration: "none" }}>{selected.driverPhone}</a>
                      </div>
                    )}
                    {selected.taxiNumber && (
                      <div>
                        <p style={{ margin: "0 0 4px", fontSize: "0.68rem", color: "#4b5563", textTransform: "uppercase", fontWeight: 700 }}>Taxi Number</p>
                        <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#eab308" }}>{selected.taxiNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : selected.status === "confirmed" ? (
              <div style={{ marginBottom: 16, padding: "12px 16px", background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: 10 }}>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#eab308" }}>⏳ Driver details will be assigned shortly. Please check back soon.</p>
              </div>
            ) : null}

            {/* Contact us */}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              {selected.driverPhone ? (
                <a href={`tel:${selected.driverPhone}`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#eab308", color: "#000", fontWeight: 700, borderRadius: 10, padding: "12px", textDecoration: "none", fontSize: "0.88rem" }}>
                  <Phone size={14} /> Call Driver
                </a>
              ) : (
                <a href="tel:+441234567890" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#eab308", color: "#000", fontWeight: 700, borderRadius: 10, padding: "12px", textDecoration: "none", fontSize: "0.88rem" }}>
                  <Phone size={14} /> Call AliTaxis
                </a>
              )}
              <a href="mailto:alitaxis@example.com" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(255,255,255,0.05)", color: "#d1d5db", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 600, borderRadius: 10, padding: "12px", textDecoration: "none", fontSize: "0.88rem" }}>
                <Mail size={14} /> Email Us
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
