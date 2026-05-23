import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password)
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });

    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

    const user = await User.create({
      name, email: email.toLowerCase(),
      phone: phone || null,
      password: hashPassword(password),
      role: "user",
    });

    const token = createToken(user._id.toString(), user.role);
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone, role: user.role },
    }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
