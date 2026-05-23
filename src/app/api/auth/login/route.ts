import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !verifyPassword(password, user.password))
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = createToken(user._id.toString(), user.role);
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
