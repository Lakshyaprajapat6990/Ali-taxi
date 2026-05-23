import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getSession } from "@/lib/auth";

const VEHICLE_PRICES: Record<string, number> = {
  economy: 1.8, standard: 2.2, executive: 3.0, mpv: 3.5,
};
const AIRPORT_ROUTES: Record<string, { basePrice: number }> = {
  stansted: { basePrice: 80 },
  gatwick:  { basePrice: 160 },
  heathrow: { basePrice: 150 },
  luton:    { basePrice: 110 },
};

function toPlain(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  if (obj.userId) obj.userId = obj.userId.toString();
  if (obj.user?._id) obj.user.id = obj.user._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

// GET all bookings (admin) or current user's bookings
export async function GET() {
  try {
    await connectDB();
    const session = await getSession();

    let query: any = {};
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.role !== "admin") query.userId = session.id;

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone")
      .lean();

    const plain = bookings.map((b: any) => {
      const obj: any = { ...b, id: b._id.toString() };
      delete obj._id; delete obj.__v;
      if (obj.userId && typeof obj.userId === "object") {
        obj.user = { id: obj.userId._id.toString(), name: obj.userId.name, email: obj.userId.email, phone: obj.userId.phone };
        obj.userId = obj.userId._id.toString();
      } else if (obj.userId) {
        obj.userId = obj.userId.toString();
      }
      return obj;
    });

    return NextResponse.json(plain);
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST create booking
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    const body = await request.json();

    const {
      pickupLocation, dropoffLocation, pickupDate, pickupTime,
      passengers, luggage, vehicleType,
      customerName, customerEmail, customerPhone, specialRequests,
      locationLat, locationLng, locationAddress,
    } = body;

    // Estimate price
    let price = 50;
    const dropLower = (dropoffLocation ?? "").toLowerCase();
    for (const [key, route] of Object.entries(AIRPORT_ROUTES)) {
      if (dropLower.includes(key)) {
        price = Math.round(route.basePrice * ((VEHICLE_PRICES[vehicleType] ?? 2.2) / 2));
        break;
      }
    }

    const booking = await Booking.create({
      pickupLocation, dropoffLocation, pickupDate, pickupTime,
      passengers: Number(passengers),
      luggage: Number(luggage),
      vehicleType, customerName, customerEmail, customerPhone,
      specialRequests: specialRequests || null,
      price,
      status: "pending",
      locationLat:     locationLat     ?? null,
      locationLng:     locationLng     ?? null,
      locationAddress: locationAddress ?? null,
      userId: session?.id ?? null,
    });

    const populated = await booking.populate("userId", "name email phone");
    return NextResponse.json(toPlain(populated), { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

// PATCH update booking status
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const { id, status } = await request.json();
    const booking = await Booking.findByIdAndUpdate(
      id, { status }, { new: true }
    ).populate("userId", "name email phone");

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json(toPlain(booking));
  } catch (error) {
    console.error("PATCH /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
