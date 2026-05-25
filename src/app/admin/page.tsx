"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Phone, Mail, MapPin, Clock, Users, Luggage, Car,
  CheckCircle, XCircle, AlertCircle, RefreshCw,
  TrendingUp, Calendar, MessageSquare, Eye, ChevronDown,
  Plane, Search, Filter, LogOut, Navigation, Edit3,
  Save, Plus, Trash2, Image, Type, Globe, Upload, X, UserCheck,
} from "lucide-react";

/* ─── Types ─── */
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
type ContactStatus = "new" | "read" | "resolved";
type Tab = "bookings" | "contacts" | "content";

interface BookingUser { id: string; name: string; email: string; phone?: string; }
interface Booking {
  id: string; customerName: string; customerEmail: string; customerPhone: string;
  pickupLocation: string; locationLat?: number; locationLng?: number; locationAddress?: string;
  user?: BookingUser; dropoffLocation: string; pickupDate: string; pickupTime: string;
  passengers: number; luggage: number; vehicleType: string; specialRequests?: string;
  price: number; status: BookingStatus; createdAt: string;
  driverName?: string; driverPhone?: string; taxiNumber?: string;
}
interface Contact {
  id: string; name: string; email: string; phone: string; message: string;
  status: ContactStatus; createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending:   { bg: "rgba(234,179,8,0.12)",  text: "#eab308", dot: "#eab308" },
  confirmed: { bg: "rgba(59,130,246,0.12)", text: "#60a5fa", dot: "#3b82f6" },
  completed: { bg: "rgba(34,197,94,0.12)",  text: "#4ade80", dot: "#22c55e" },
  cancelled: { bg: "rgba(239,68,68,0.12)",  text: "#f87171", dot: "#ef4444" },
  new:       { bg: "rgba(234,179,8,0.12)",  text: "#eab308", dot: "#eab308" },
  read:      { bg: "rgba(59,130,246,0.12)", text: "#60a5fa", dot: "#3b82f6" },
  resolved:  { bg: "rgba(34,197,94,0.12)",  text: "#4ade80", dot: "#22c55e" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: "rgba(107,114,128,0.2)", text: "#9ca3af", dot: "#6b7280" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: c.bg, color: c.text, padding: "4px 12px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700, textTransform: "capitalize", letterSpacing: "0.04em" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function formatDate(str: string) { return new Date(str).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
function formatTime(str: string) { return new Date(str).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ─── Input style helper ─── */
const fieldStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8, color: "#fff", padding: "9px 12px", fontSize: "0.88rem",
  boxSizing: "border-box", outline: "none",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.72rem", color: "#6b7280", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6,
};
const cardStyle: React.CSSProperties = {
  background: "rgba(10,15,28,0.9)", border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 16, padding: "24px",
};

/* ════════════════════════════════════════
   IMAGE UPLOADER COMPONENT
════════════════════════════════════════ */
function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const [preview, setPreview]     = useState(value);

  useEffect(() => { setPreview(value); }, [value]);

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Upload failed"); return; }
      setPreview(data.url);
      onChange(data.url);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {/* URL input row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={value}
          onChange={e => { onChange(e.target.value); setPreview(e.target.value); }}
          placeholder="https://... or /uploads/filename.jpg"
          style={{ ...fieldStyle, flex: 1 }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: uploading ? "rgba(139,92,246,0.1)" : "rgba(139,92,246,0.18)",
            border: "1px solid rgba(139,92,246,0.35)",
            borderRadius: 8, color: "#a78bfa", padding: "8px 14px",
            cursor: uploading ? "not-allowed" : "pointer",
            fontSize: "0.82rem", fontWeight: 700, whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}>
          {uploading
            ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Uploading…</>
            : <><Upload size={13} /> Upload Image</>}
        </button>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      </div>

      {/* Drag & drop zone */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        style={{
          border: "2px dashed rgba(139,92,246,0.25)", borderRadius: 10,
          padding: "10px", textAlign: "center", cursor: "pointer",
          background: "rgba(139,92,246,0.04)", transition: "border-color 0.15s",
          position: "relative", overflow: "hidden",
        }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={preview} alt="Preview"
              style={{ maxHeight: 100, maxWidth: "100%", borderRadius: 6, objectFit: "cover", display: "block", margin: "0 auto" }}
              onError={() => setPreview("")}
            />
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onChange(""); setPreview(""); }}
              style={{
                position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.7)",
                border: "none", borderRadius: "50%", width: 22, height: 22,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#fff",
              }}>
              <X size={12} />
            </button>
          </div>
        ) : (
          <div style={{ padding: "8px 0", pointerEvents: "none" }}>
            <Image size={22} color="#4b5563" style={{ margin: "0 auto 6px" }} />
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#4b5563" }}>
              Drag & drop or click to upload · JPG, PNG, WebP · max 5MB
            </p>
          </div>
        )}
      </div>

      {error && <p style={{ margin: "6px 0 0", fontSize: "0.75rem", color: "#f87171" }}>{error}</p>}
    </div>
  );
}

/* ════════════════════════════════════════
   CONTENT EDITOR COMPONENT
════════════════════════════════════════ */
function ContentEditor() {
  const [section, setSection] = useState<"hero" | "airports" | "vehicles" | "services" | "contact" | "footer">("hero");
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then(d => setContent(d.content));
  }, []);

  const save = async (key: string, data: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data }),
      });
      if (res.ok) {
        setSaved(key);
        setTimeout(() => setSaved(null), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!content) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: "#4b5563" }}>
      <RefreshCw size={24} style={{ animation: "spin 1s linear infinite" }} />
      <p style={{ marginTop: 12 }}>Loading content…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const sections = [
    { id: "hero",     label: "Hero Section",   icon: <Globe size={14} /> },
    { id: "airports", label: "Airport Cards",  icon: <Plane size={14} /> },
    { id: "vehicles", label: "Vehicle Cards",  icon: <Car size={14} /> },
    { id: "services", label: "Services",       icon: <CheckCircle size={14} /> },
    { id: "contact",  label: "Contact Info",   icon: <Phone size={14} /> },
    { id: "footer",   label: "Footer",         icon: <Type size={14} /> },
  ];

  return (
    <div style={{ display: "flex", gap: 24 }}>
      {/* Section nav */}
      <div style={{ width: 200, flexShrink: 0 }}>
        <div style={{ ...cardStyle, padding: "12px" }}>
          <p style={{ ...labelStyle, padding: "4px 8px", marginBottom: 8 }}>Sections</p>
          {sections.map(s => (
            <button key={s.id} onClick={() => setSection(s.id as any)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 10px",
              borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2,
              background: section === s.id ? "rgba(234,179,8,0.12)" : "transparent",
              color: section === s.id ? "#eab308" : "#6b7280",
              fontWeight: section === s.id ? 700 : 400, fontSize: "0.85rem", textAlign: "left",
              transition: "all 0.15s",
            }}>
              {s.icon}
              {s.label}
              {saved === s.id && <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "#4ade80" }}>✓ Saved</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Editor panel */}
      <div style={{ flex: 1 }}>

        {/* ── HERO ── */}
        {section === "hero" && (() => {
          const h = content.hero;
          const upd = (k: string, v: string) => setContent((c: any) => ({ ...c, hero: { ...c.hero, [k]: v } }));
          return (
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>Hero Section</h3>
                <button onClick={() => save("hero", content.hero)} disabled={saving} style={{ background: "#eab308", color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                  <Save size={14} /> {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
              {[
                { key: "title",       label: "Title",       type: "text" },
                { key: "subtitle",    label: "Subtitle",    type: "text" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "phone",       label: "Phone Number",type: "text" },
                { key: "email",       label: "Email",       type: "text" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>{f.label}</label>
                  {f.type === "textarea"
                    ? <textarea value={h[f.key]} onChange={e => upd(f.key, e.target.value)} rows={3}
                        style={{ ...fieldStyle, resize: "vertical" }} />
                    : <input value={h[f.key]} onChange={e => upd(f.key, e.target.value)} style={fieldStyle} />
                  }
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── AIRPORTS ── */}
        {section === "airports" && (() => {
          const airports: any[] = content.airports;
          const updAirport = (i: number, k: string, v: any) => setContent((c: any) => {
            const arr = [...c.airports];
            arr[i] = { ...arr[i], [k]: v };
            return { ...c, airports: arr };
          });
          return (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>Airport Cards</h3>
                <button onClick={() => save("airports", content.airports)} disabled={saving} style={{ background: "#eab308", color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                  <Save size={14} /> {saving ? "Saving…" : "Save All"}
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {airports.map((a, i) => (
                  <div key={i} style={cardStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      {a.image && <img src={a.image} alt="" style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }} />}
                      <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#eab308" }}>{a.name}</h4>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[
                        { k: "name",          l: "Airport Name",    t: "text"   },
                        { k: "code",          l: "Code (e.g. LHR)", t: "text"   },
                        { k: "distance",      l: "Distance (miles)",t: "number" },
                        { k: "basePrice",     l: "Base Price (£)",  t: "number" },
                        { k: "estimatedTime", l: "Est. Time",       t: "text"   },
                      ].map(f => (
                        <div key={f.k}>
                          <label style={labelStyle}>{f.l}</label>
                          <input type={f.t} value={a[f.k]} onChange={e => updAirport(i, f.k, f.t === "number" ? Number(e.target.value) : e.target.value)}
                            style={fieldStyle} />
                        </div>
                      ))}
                    </div>
                    {/* Image uploader */}
                    <div style={{ marginTop: 12 }}>
                      <label style={labelStyle}>Airport Image</label>
                      <ImageUploader value={a.image} onChange={url => updAirport(i, "image", url)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── VEHICLES ── */}
        {section === "vehicles" && (() => {
          const vehicles: any[] = content.vehicles;
          const updVehicle = (i: number, k: string, v: any) => setContent((c: any) => {
            const arr = [...c.vehicles];
            arr[i] = { ...arr[i], [k]: v };
            return { ...c, vehicles: arr };
          });
          return (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>Vehicle Cards</h3>
                <button onClick={() => save("vehicles", content.vehicles)} disabled={saving} style={{ background: "#eab308", color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                  <Save size={14} /> {saving ? "Saving…" : "Save All"}
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {vehicles.map((v, i) => (
                  <div key={i} style={cardStyle}>
                    <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                      <div style={{ width: 90, height: 60, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.04)" }}>
                        <img src={v.image} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#eab308" }}>{v.name}</h4>
                        <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#4b5563" }}>{v.badge}</p>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[
                        { k: "name",         l: "Vehicle Name",     t: "text"   },
                        { k: "badge",        l: "Badge Label",      t: "text"   },
                        { k: "description",  l: "Description",      t: "text"   },
                        { k: "capacity",     l: "Passengers",       t: "number" },
                        { k: "luggage",      l: "Luggage",          t: "number" },
                        { k: "pricePerMile", l: "Price/Mile (£)",   t: "number" },
                      ].map(f => (
                        <div key={f.k}>
                          <label style={labelStyle}>{f.l}</label>
                          <input type={f.t} value={v[f.k]} onChange={e => updVehicle(i, f.k, f.t === "number" ? Number(e.target.value) : e.target.value)}
                            style={fieldStyle} />
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <label style={labelStyle}>Vehicle Image</label>
                      <ImageUploader value={v.image} onChange={url => updVehicle(i, "image", url)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── SERVICES ── */}
        {section === "services" && (() => {
          const svcs: any[] = content.services;
          const updSvc = (i: number, k: string, v: string) => setContent((c: any) => {
            const arr = [...c.services];
            arr[i] = { ...arr[i], [k]: v };
            return { ...c, services: arr };
          });
          return (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>Services Section</h3>
                <button onClick={() => save("services", content.services)} disabled={saving} style={{ background: "#eab308", color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                  <Save size={14} /> {saving ? "Saving…" : "Save All"}
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {svcs.map((s, i) => (
                  <div key={i} style={cardStyle}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Title</label>
                        <input value={s.title} onChange={e => updSvc(i, "title", e.target.value)} style={fieldStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Icon name</label>
                        <input value={s.icon} onChange={e => updSvc(i, "icon", e.target.value)} style={fieldStyle} placeholder="Plane, MapPin, Clock…" />
                      </div>
                      <div style={{ gridColumn: "1/-1" }}>
                        <label style={labelStyle}>Description</label>
                        <textarea value={s.description} onChange={e => updSvc(i, "description", e.target.value)} rows={2} style={{ ...fieldStyle, resize: "vertical" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── CONTACT ── */}
        {section === "contact" && (() => {
          const ct = content.contact;
          const upd = (k: string, v: string) => setContent((c: any) => ({ ...c, contact: { ...c.contact, [k]: v } }));
          return (
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>Contact Information</h3>
                <button onClick={() => save("contact", content.contact)} disabled={saving} style={{ background: "#eab308", color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                  <Save size={14} /> {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
              {[
                { k: "phone",   l: "Phone Number" },
                { k: "email",   l: "Email Address" },
                { k: "address", l: "Address"       },
                { k: "hours",   l: "Opening Hours" },
              ].map(f => (
                <div key={f.k} style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>{f.l}</label>
                  <input value={ct[f.k]} onChange={e => upd(f.k, e.target.value)} style={fieldStyle} />
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── FOOTER ── */}
        {section === "footer" && (() => {
          const ft = content.footer;
          const upd = (k: string, v: string) => setContent((c: any) => ({ ...c, footer: { ...c.footer, [k]: v } }));
          return (
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>Footer Text</h3>
                <button onClick={() => save("footer", content.footer)} disabled={saving} style={{ background: "#eab308", color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                  <Save size={14} /> {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
              {[
                { k: "tagline",   l: "Tagline"   },
                { k: "copyright", l: "Copyright" },
              ].map(f => (
                <div key={f.k} style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>{f.l}</label>
                  <input value={ft[f.k]} onChange={e => upd(f.k, e.target.value)} style={fieldStyle} />
                </div>
              ))}
              <div style={{ marginTop: 16, padding: "14px", background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: 10 }}>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#eab308" }}>
                  💡 After saving, refresh the main website to see your changes live.
                </p>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN ADMIN DASHBOARD
════════════════════════════════════════ */
export default function AdminDashboard() {
  const [tab, setTab]             = useState<Tab>("bookings");
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [contacts, setContacts]   = useState<Contact[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [updating, setUpdating]   = useState<string | null>(null);
  const [driverForm, setDriverForm] = useState({ driverName: "", driverPhone: "", taxiNumber: "" });
  const [savingDriver, setSavingDriver] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([fetch("/api/bookings"), fetch("/api/contact")]);
      const [b, c] = await Promise.all([bRes.json(), cRes.json()]);
      setBookings(Array.isArray(b) ? b : []);
      setContacts(Array.isArray(c) ? c : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        if (selectedBooking?.id === id) setSelectedBooking(prev => prev ? { ...prev, status } : prev);
      }
    } finally { setUpdating(null); }
  };

  const updateContactStatus = async (id: string, status: ContactStatus) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/contact", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      if (res.ok) {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        if (selectedContact?.id === id) setSelectedContact(prev => prev ? { ...prev, status } : prev);
      }
    } finally { setUpdating(null); }
  };

  const saveDriverDetails = async () => {
    if (!selectedBooking) return;
    setSavingDriver(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedBooking.id, ...driverForm }),
      });
      if (res.ok) {
        const updated = { ...selectedBooking, ...driverForm };
        setSelectedBooking(updated);
        setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, ...driverForm } : b));
      }
    } finally {
      setSavingDriver(false);
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    revenue: bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.price, 0),
    newMsgs: contacts.filter(c => c.status === "new").length,
  };

  const filteredBookings = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.customerName.toLowerCase().includes(q) || b.customerEmail.toLowerCase().includes(q) || b.customerPhone.includes(q) || b.pickupLocation.toLowerCase().includes(q) || b.dropoffLocation.toLowerCase().includes(q);
    return matchSearch && (statusFilter === "all" || b.status === statusFilter);
  });

  const filteredContacts = contacts.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.message.toLowerCase().includes(q);
    return matchSearch && (statusFilter === "all" || c.status === statusFilter);
  });

  return (
    <div style={{ minHeight: "100vh", background: "#050810", color: "#fff", fontFamily: "inherit", display: "flex" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 240, background: "rgba(10,15,28,0.98)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, background: "#eab308", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Plane size={18} color="#000" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "#eab308", letterSpacing: "0.05em" }}>ALITAXIS</p>
              <p style={{ margin: 0, fontSize: "0.6rem", color: "#4b5563", letterSpacing: "0.1em" }}>ADMIN PANEL</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <p style={{ fontSize: "0.65rem", color: "#374151", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>Navigation</p>
          {[
            { id: "bookings", label: "Bookings",       icon: <Calendar size={16} />,      count: stats.pending  },
            { id: "contacts", label: "Messages",       icon: <MessageSquare size={16} />, count: stats.newMsgs  },
            { id: "content",  label: "Edit Website",   icon: <Edit3 size={16} />,         count: 0              },
          ].map(item => (
            <button key={item.id}
              onClick={() => { setTab(item.id as Tab); setSearch(""); setStatusFilter("all"); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 10, border: "none", cursor: "pointer",
                background: tab === item.id ? (item.id === "content" ? "rgba(139,92,246,0.12)" : "rgba(234,179,8,0.12)") : "none",
                color: tab === item.id ? (item.id === "content" ? "#a78bfa" : "#eab308") : "#6b7280",
                fontWeight: tab === item.id ? 700 : 500, fontSize: "0.88rem", marginBottom: 4, transition: "all 0.15s",
              }}>
              {item.icon}
              <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
              {item.count > 0 && (
                <span style={{ background: "#eab308", color: "#000", borderRadius: 999, fontSize: "0.65rem", fontWeight: 800, padding: "1px 7px" }}>{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, color: "#4b5563", fontSize: "0.82rem", textDecoration: "none" }}>
            <LogOut size={14} /> Back to Website
          </a>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ marginLeft: 240, flex: 1, padding: "32px 32px 60px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {tab === "bookings" ? "Booking Enquiries" : tab === "contacts" ? "Customer Messages" : "Edit Website Content"}
            </h1>
            <p style={{ margin: "4px 0 0", color: "#4b5563", fontSize: "0.88rem" }}>
              {tab === "bookings" ? `${bookings.length} total · ${stats.pending} pending` :
               tab === "contacts" ? `${contacts.length} total · ${stats.newMsgs} unread` :
               "Edit text, images and content visible on your website"}
            </p>
          </div>
          {tab !== "content" && (
            <button onClick={fetchAll} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af", borderRadius: 10, padding: "9px 16px", cursor: "pointer", fontSize: "0.85rem" }}>
              <RefreshCw size={14} /> Refresh
            </button>
          )}
        </div>

        {/* ── CONTENT EDITOR TAB ── */}
        {tab === "content" && <ContentEditor />}

        {/* ── Stats (bookings) ── */}
        {tab === "bookings" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 28 }}>
            {[
              { label: "Total Bookings", value: stats.total,     color: "#fff",    icon: <Calendar size={18} /> },
              { label: "Pending",        value: stats.pending,   color: "#eab308", icon: <AlertCircle size={18} /> },
              { label: "Confirmed",      value: stats.confirmed, color: "#60a5fa", icon: <CheckCircle size={18} /> },
              { label: "Completed",      value: stats.completed, color: "#4ade80", icon: <CheckCircle size={18} /> },
              { label: "Est. Revenue",   value: `£${stats.revenue.toLocaleString()}`, color: "#a78bfa", icon: <TrendingUp size={18} /> },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(10,15,28,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#4b5563", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                  <span style={{ color: s.color, opacity: 0.7 }}>{s.icon}</span>
                </div>
                <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Stats (contacts) ── */}
        {tab === "contacts" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            {[
              { label: "Total Messages", value: contacts.length, color: "#fff", icon: <MessageSquare size={18} /> },
              { label: "Unread",  value: contacts.filter(c => c.status === "new").length, color: "#eab308", icon: <AlertCircle size={18} /> },
              { label: "Resolved",value: contacts.filter(c => c.status === "resolved").length, color: "#4ade80", icon: <CheckCircle size={18} /> },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(10,15,28,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#4b5563", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</p>
                  <span style={{ color: s.color, opacity: 0.7 }}>{s.icon}</span>
                </div>
                <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Search/filter bar ── */}
        {tab !== "content" && (
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={tab === "bookings" ? "Search by name, email, phone, location…" : "Search by name, email, message…"}
                style={{ width: "100%", background: "rgba(10,15,28,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", padding: "10px 14px 10px 40px", fontSize: "0.88rem", boxSizing: "border-box", outline: "none" }} />
            </div>
            <div style={{ position: "relative" }}>
              <Filter size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4b5563", pointerEvents: "none" }} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ background: "rgba(10,15,28,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#9ca3af", padding: "10px 36px 10px 36px", fontSize: "0.88rem", cursor: "pointer", outline: "none", appearance: "none" }}>
                <option value="all">All Status</option>
                {tab === "bookings"
                  ? ["pending","confirmed","completed","cancelled"].map(s => <option key={s} value={s}>{cap(s)}</option>)
                  : ["new","read","resolved"].map(s => <option key={s} value={s}>{cap(s)}</option>)}
              </select>
              <ChevronDown size={13} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#4b5563", pointerEvents: "none" }} />
            </div>
          </div>
        )}

        {loading && tab !== "content" && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#4b5563" }}>
            <RefreshCw size={28} style={{ animation: "spin 1s linear infinite", marginBottom: 12 }} />
            <p style={{ margin: 0 }}>Loading data…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── Bookings table ── */}
        {!loading && tab === "bookings" && (
          <div style={{ background: "rgba(10,15,28,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  {["Customer","Contact","Journey","Live Location","Vehicle","Date & Time","Price","Status","Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: "60px 0", textAlign: "center", color: "#374151" }}>No bookings found</td></tr>
                ) : filteredBookings.map((b, i) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(234,179,8,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "#eab308", flexShrink: 0 }}>{b.customerName.charAt(0).toUpperCase()}</div>
                        <div>
                          <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600 }}>{b.customerName}</p>
                          <p style={{ margin: 0, fontSize: "0.72rem", color: "#4b5563" }}>#{b.id.slice(-6).toUpperCase()}</p>
                          {b.user && <span style={{ fontSize: "0.65rem", background: "rgba(34,197,94,0.1)", color: "#4ade80", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>Registered User</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <a href={`mailto:${b.customerEmail}`} style={{ color: "#9ca3af", fontSize: "0.78rem", textDecoration: "none", display: "block" }}>{b.customerEmail}</a>
                      <a href={`tel:${b.customerPhone}`} style={{ color: "#eab308", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>{b.customerPhone}</a>
                    </td>
                    <td style={{ padding: "14px 16px", maxWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4 }}>
                        <MapPin size={12} style={{ color: "#4ade80", flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: "0.78rem", color: "#d1d5db" }}>{b.pickupLocation}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <MapPin size={12} style={{ color: "#f87171", flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: "0.78rem", color: "#d1d5db" }}>{b.dropoffLocation}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", maxWidth: 160 }}>
                      {b.locationLat && b.locationLng ? (
                        <div>
                          <a href={`https://www.google.com/maps?q=${b.locationLat},${b.locationLng}`} target="_blank" rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: 5, color: "#eab308", fontSize: "0.75rem", fontWeight: 600, textDecoration: "none", marginBottom: 4 }}>
                            <Navigation size={11} /> View on Map
                          </a>
                          <p style={{ margin: 0, fontSize: "0.68rem", color: "#374151" }}>{b.locationAddress ? b.locationAddress.slice(0, 45) + "…" : `${b.locationLat.toFixed(4)}, ${b.locationLng.toFixed(4)}`}</p>
                        </div>
                      ) : <span style={{ fontSize: "0.72rem", color: "#1f2937" }}>No location</span>}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 10px", fontSize: "0.75rem", fontWeight: 600, color: "#d1d5db", textTransform: "capitalize" }}>{b.vehicleType}</span>
                      <div style={{ display: "flex", gap: 8, marginTop: 5 }}>
                        <span style={{ fontSize: "0.72rem", color: "#4b5563", display: "flex", alignItems: "center", gap: 3 }}><Users size={10} />{b.passengers}</span>
                        <span style={{ fontSize: "0.72rem", color: "#4b5563", display: "flex", alignItems: "center", gap: 3 }}><Luggage size={10} />{b.luggage}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "#d1d5db" }}>{b.pickupDate}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#4b5563" }}>{b.pickupTime}</p>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#eab308" }}>£{b.price}</p>
                    </td>
                    <td style={{ padding: "14px 16px" }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button onClick={() => { setSelectedBooking(b); setDriverForm({ driverName: b.driverName || "", driverPhone: b.driverPhone || "", taxiNumber: b.taxiNumber || "" }); }} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 7, color: "#9ca3af", padding: "5px 9px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}><Eye size={12} /> View</button>
                        {b.status === "pending" && <button onClick={() => updateBookingStatus(b.id, "confirmed")} disabled={updating === b.id} style={{ background: "rgba(59,130,246,0.15)", border: "none", borderRadius: 7, color: "#60a5fa", padding: "5px 9px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Confirm</button>}
                        {b.status === "confirmed" && <button onClick={() => updateBookingStatus(b.id, "completed")} disabled={updating === b.id} style={{ background: "rgba(34,197,94,0.15)", border: "none", borderRadius: 7, color: "#4ade80", padding: "5px 9px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Complete</button>}
                        {(b.status === "pending" || b.status === "confirmed") && <button onClick={() => updateBookingStatus(b.id, "cancelled")} disabled={updating === b.id} style={{ background: "rgba(239,68,68,0.12)", border: "none", borderRadius: 7, color: "#f87171", padding: "5px 9px", cursor: "pointer", fontSize: "0.75rem" }}>Cancel</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Contacts table ── */}
        {!loading && tab === "contacts" && (
          <div style={{ background: "rgba(10,15,28,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  {["Customer","Contact","Message","Received","Status","Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: "60px 0", textAlign: "center", color: "#374151" }}>No messages found</td></tr>
                ) : filteredContacts.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(234,179,8,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "#eab308", flexShrink: 0 }}>{c.name.charAt(0).toUpperCase()}</div>
                        <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600 }}>{c.name}</p>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <a href={`mailto:${c.email}`} style={{ color: "#9ca3af", fontSize: "0.78rem", textDecoration: "none", display: "block" }}>{c.email}</a>
                      <a href={`tel:${c.phone}`} style={{ color: "#eab308", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>{c.phone}</a>
                    </td>
                    <td style={{ padding: "14px 16px", maxWidth: 300 }}>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "#9ca3af", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{c.message}</p>
                    </td>
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "#d1d5db" }}>{formatDate(c.createdAt)}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#4b5563" }}>{formatTime(c.createdAt)}</p>
                    </td>
                    <td style={{ padding: "14px 16px" }}><StatusBadge status={c.status} /></td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setSelectedContact(c)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 7, color: "#9ca3af", padding: "5px 9px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}><Eye size={12} /> Read</button>
                        {c.status === "new" && <button onClick={() => updateContactStatus(c.id, "read")} disabled={updating === c.id} style={{ background: "rgba(59,130,246,0.15)", border: "none", borderRadius: 7, color: "#60a5fa", padding: "5px 9px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Mark Read</button>}
                        {c.status !== "resolved" && <button onClick={() => updateContactStatus(c.id, "resolved")} disabled={updating === c.id} style={{ background: "rgba(34,197,94,0.12)", border: "none", borderRadius: 7, color: "#4ade80", padding: "5px 9px", cursor: "pointer", fontSize: "0.75rem" }}>Resolve</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── Booking modal ── */}
      {selectedBooking && (
        <div onClick={e => e.target === e.currentTarget && setSelectedBooking(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, width: "100%", maxWidth: 620, maxHeight: "90vh", overflowY: "auto", padding: "32px 28px", position: "relative" }}>
            <button onClick={() => setSelectedBooking(null)} style={{ position: "absolute", top: 18, right: 18, background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, color: "#6b7280", cursor: "pointer", padding: "6px 8px", fontSize: "1rem" }}>✕</button>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(234,179,8,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 800, color: "#eab308" }}>{selectedBooking.customerName.charAt(0).toUpperCase()}</div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>{selectedBooking.customerName}</h2>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#4b5563" }}>Booking #{selectedBooking.id.slice(-8).toUpperCase()}</p>
              </div>
              <div style={{ marginLeft: "auto" }}><StatusBadge status={selectedBooking.status} /></div>
            </div>
            {[
              { title: "Contact Information", rows: [{ icon: <Mail size={14} />, label: "Email", value: selectedBooking.customerEmail }, { icon: <Phone size={14} />, label: "Phone", value: selectedBooking.customerPhone }] },
              { title: "Journey Details", rows: [{ icon: <MapPin size={14} color="#4ade80" />, label: "Pickup", value: selectedBooking.pickupLocation }, { icon: <MapPin size={14} color="#f87171" />, label: "Drop-off", value: selectedBooking.dropoffLocation }, { icon: <Calendar size={14} />, label: "Date", value: selectedBooking.pickupDate }, { icon: <Clock size={14} />, label: "Time", value: selectedBooking.pickupTime }] },
              { title: "Vehicle & Passengers", rows: [{ icon: <Car size={14} />, label: "Vehicle", value: cap(selectedBooking.vehicleType) }, { icon: <Users size={14} />, label: "Passengers", value: String(selectedBooking.passengers) }, { icon: <Luggage size={14} />, label: "Luggage", value: String(selectedBooking.luggage) + " bags" }] },
            ].map(section => (
              <div key={section.title} style={{ marginBottom: 20 }}>
                <p style={{ margin: "0 0 10px", fontSize: "0.7rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em" }}>{section.title}</p>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
                  {section.rows.map((row, i) => (
                    <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: i < section.rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <span style={{ color: "#4b5563", flexShrink: 0 }}>{row.icon}</span>
                      <span style={{ fontSize: "0.78rem", color: "#4b5563", width: 80, flexShrink: 0 }}>{row.label}</span>
                      <span style={{ fontSize: "0.88rem", color: "#d1d5db", fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {selectedBooking.locationLat && selectedBooking.locationLng && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ margin: "0 0 10px", fontSize: "0.7rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em" }}>Customer Live Location</p>
                <div style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: 12, padding: "14px 16px" }}>
                  <p style={{ margin: "0 0 10px", fontSize: "0.88rem", color: "#d1d5db" }}>{selectedBooking.locationAddress}</p>
                  <a href={`https://www.google.com/maps?q=${selectedBooking.locationLat},${selectedBooking.locationLng}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eab308", color: "#000", fontWeight: 700, fontSize: "0.78rem", padding: "7px 14px", borderRadius: 8, textDecoration: "none" }}>
                    <MapPin size={12} /> Open in Google Maps
                  </a>
                </div>
              </div>
            )}
            {selectedBooking.user && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ margin: "0 0 10px", fontSize: "0.7rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em" }}>Registered Account</p>
                <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#4ade80", flexShrink: 0 }}>{selectedBooking.user.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#fff" }}>{selectedBooking.user.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#4b5563" }}>{selectedBooking.user.email}</p>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: "0.65rem", background: "rgba(34,197,94,0.1)", color: "#4ade80", padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>Verified</span>
                </div>
              </div>
            )}
            {/* ── Driver Details Assignment ── */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: "0 0 10px", fontSize: "0.7rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em" }}>Assign Driver Details</p>
              <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 12, padding: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>Driver Name</label>
                    <input value={driverForm.driverName} onChange={e => setDriverForm(f => ({ ...f, driverName: e.target.value }))} placeholder="e.g. John Smith" style={fieldStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Driver Phone</label>
                    <input value={driverForm.driverPhone} onChange={e => setDriverForm(f => ({ ...f, driverPhone: e.target.value }))} placeholder="e.g. 07700 900000" style={fieldStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Taxi Number</label>
                    <input value={driverForm.taxiNumber} onChange={e => setDriverForm(f => ({ ...f, taxiNumber: e.target.value }))} placeholder="e.g. AB12 CDE" style={fieldStyle} />
                  </div>
                </div>
                <button onClick={saveDriverDetails} disabled={savingDriver} style={{ background: savingDriver ? "rgba(59,130,246,0.3)" : "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: savingDriver ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                  <Save size={13} /> {savingDriver ? "Saving…" : "Save Driver Details"}
                </button>
                {(selectedBooking.driverName || selectedBooking.driverPhone || selectedBooking.taxiNumber) && (
                  <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 8 }}>
                    <p style={{ margin: 0, fontSize: "0.72rem", color: "#4ade80", fontWeight: 700 }}>✓ Driver assigned — customer can see these details in their dashboard</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: 12, padding: "14px 16px" }}>
                <p style={{ margin: "0 0 4px", fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase" }}>Estimated Price</p>
                <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#eab308" }}>£{selectedBooking.price}</p>
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px" }}>
                <p style={{ margin: "0 0 4px", fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase" }}>Received</p>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#d1d5db", fontWeight: 600 }}>{formatDate(selectedBooking.createdAt)}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {selectedBooking.status === "pending" && <>
                <button onClick={() => updateBookingStatus(selectedBooking.id, "confirmed")} style={{ flex: 1, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer", fontWeight: 700 }}>✓ Confirm Booking</button>
                <button onClick={() => updateBookingStatus(selectedBooking.id, "cancelled")} style={{ flex: 1, background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px", cursor: "pointer", fontWeight: 700 }}>✕ Cancel</button>
              </>}
              {selectedBooking.status === "confirmed" && <button onClick={() => updateBookingStatus(selectedBooking.id, "completed")} style={{ flex: 1, background: "#22c55e", color: "#000", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer", fontWeight: 700 }}>✓ Mark as Completed</button>}
            </div>
          </div>
        </div>
      )}

      {/* ── Contact modal ── */}
      {selectedContact && (
        <div onClick={e => e.target === e.currentTarget && setSelectedContact(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, width: "100%", maxWidth: 520, padding: "32px 28px", position: "relative" }}>
            <button onClick={() => setSelectedContact(null)} style={{ position: "absolute", top: 18, right: 18, background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, color: "#6b7280", cursor: "pointer", padding: "6px 8px", fontSize: "1rem" }}>✕</button>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(234,179,8,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 800, color: "#eab308" }}>{selectedContact.name.charAt(0).toUpperCase()}</div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>{selectedContact.name}</h2>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#4b5563" }}>{formatDate(selectedContact.createdAt)}</p>
              </div>
              <div style={{ marginLeft: "auto" }}><StatusBadge status={selectedContact.status} /></div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
              {[{ icon: <Mail size={14} />, label: "Email", value: selectedContact.email }, { icon: <Phone size={14} />, label: "Phone", value: selectedContact.phone }].map((row, i) => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <span style={{ color: "#4b5563" }}>{row.icon}</span>
                  <span style={{ fontSize: "0.78rem", color: "#4b5563", width: 60 }}>{row.label}</span>
                  <span style={{ fontSize: "0.88rem", color: "#d1d5db" }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px", marginBottom: 24 }}>
              <p style={{ margin: 0, fontSize: "0.92rem", color: "#d1d5db", lineHeight: 1.7 }}>{selectedContact.message}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {selectedContact.status === "new" && <button onClick={() => updateContactStatus(selectedContact.id, "read")} style={{ flex: 1, background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "11px", cursor: "pointer", fontWeight: 700 }}>Mark as Read</button>}
              {selectedContact.status !== "resolved" && <button onClick={() => updateContactStatus(selectedContact.id, "resolved")} style={{ flex: 1, background: "#22c55e", color: "#000", border: "none", borderRadius: 10, padding: "11px", cursor: "pointer", fontWeight: 700 }}>✓ Mark Resolved</button>}
              <a href={`mailto:${selectedContact.email}`} style={{ flex: 1, background: "#eab308", color: "#000", border: "none", borderRadius: 10, padding: "11px", cursor: "pointer", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Mail size={14} /> Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
