import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";

// One-time admin creation — protected by ADMIN_SETUP_SECRET
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const setupSecret = process.env.ADMIN_SETUP_SECRET ?? "alitaxis-admin-setup-2024";
    const { name, email, password, secret } = await request.json();

    if (secret !== setupSecret)
      return NextResponse.json({ error: "Invalid setup secret" }, { status: 403 });

    const existing = await User.findOne({ role: "admin" });
    if (existing)
      return NextResponse.json({ error: "An admin account already exists. Login instead." }, { status: 409 });

    const admin = await User.create({
      name, email: email.toLowerCase(),
      password: hashPassword(password),
      role: "admin",
    });

    // Auto-login the admin after creation
    const token = createToken(admin._id.toString(), admin.role);
    await setAuthCookie(token);

    return NextResponse.json({
      admin: { id: admin._id.toString(), name: admin.name, email: admin.email, role: admin.role },
    }, { status: 201 });
  } catch (err) {
    console.error("Create admin error:", err);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
