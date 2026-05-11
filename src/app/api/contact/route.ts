import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, phone, message } = body;

    const contact = await db.contact.create({
      data: {
        name,
        email,
        phone,
        message,
        status: "new",
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// GET all contact messages
export async function GET() {
  try {
    const contacts = await db.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
