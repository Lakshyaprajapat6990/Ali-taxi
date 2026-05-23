import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

function toPlain(doc: any) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  obj.id = (obj._id ?? obj.id).toString();
  delete obj._id; delete obj.__v;
  return obj;
}

// POST create contact message
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, phone, message } = await request.json();
    if (!name || !email || !message)
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });

    const contact = await Contact.create({ name, email, phone, message, status: "new" });
    return NextResponse.json(toPlain(contact), { status: 201 });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// GET all contacts
export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(contacts.map((c: any) => {
      const obj = { ...c, id: c._id.toString() };
      delete obj._id; delete obj.__v;
      return obj;
    }));
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

// PATCH update contact status
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const { id, status } = await request.json();
    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    return NextResponse.json(toPlain(contact));
  } catch (error) {
    console.error("PATCH /api/contact error:", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}
