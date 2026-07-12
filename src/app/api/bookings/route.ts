import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getSession } from "@/lib/auth";
import { sendMail, emailLayout, OWNER_EMAIL } from "@/lib/mail";

function bookingSummary(b: any): string {
  return `
    <p><strong>Pickup:</strong> ${b.pickupLocation}</p>
    <p><strong>Dropoff:</strong> ${b.dropoffLocation}</p>
    <p><strong>Date &amp; time:</strong> ${b.pickupDate} at ${b.pickupTime}</p>
    <p><strong>Passengers:</strong> ${b.passengers} &nbsp; <strong>Luggage:</strong> ${b.luggage}</p>
    <p><strong>Vehicle:</strong> ${b.vehicleType}</p>
    <p><strong>Estimated price:</strong> £${b.price}</p>
  `;
}

const VEHICLE_PRICES: Record<string, number> = {
  economy: 1.8, standard: 2.2, executive: 3.0, mpv: 3.5,
};
const AIRPORT_ROUTES: Record<string, { basePrice: number }> = {
  heathrow:   { basePrice: 250 },
  gatwick:    { basePrice: 270 },
  stansted:   { basePrice: 160 },
  luton:      { basePrice: 210 },
  manchester: { basePrice: 410 },
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

    // Notify owner + confirm to customer (non-blocking)
    void sendMail({
      to: OWNER_EMAIL,
      replyTo: customerEmail,
      subject: `New booking request from ${customerName}`,
      html: emailLayout("New booking request", `
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        ${bookingSummary(booking)}
        ${specialRequests ? `<p><strong>Special requests:</strong> ${specialRequests}</p>` : ""}
      `),
    });
    if (customerEmail) {
      void sendMail({
        to: customerEmail,
        subject: "Your booking request — AliTaxis Norwich",
        html: emailLayout(`Thanks, ${customerName}! Your booking is being processed.`, `
          <p>We've received your booking request. Our team will confirm your driver details shortly.</p>
          ${bookingSummary(booking)}
          <p>Status: <strong>Pending confirmation</strong></p>
          <p>— AliTaxis Norwich</p>
        `),
      });
    }

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
    const { id, status, driverName, driverPhone, taxiNumber } = await request.json();
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (driverName !== undefined) updateData.driverName = driverName;
    if (driverPhone !== undefined) updateData.driverPhone = driverPhone;
    if (taxiNumber !== undefined) updateData.taxiNumber = taxiNumber;
    const booking = await Booking.findByIdAndUpdate(
      id, updateData, { new: true }
    ).populate("userId", "name email phone");

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // Let the customer know their booking was updated (non-blocking)
    const driverAssigned = driverName || driverPhone || taxiNumber;
    if (booking.customerEmail && (status !== undefined || driverAssigned)) {
      const statusLabel = status ? String(status).charAt(0).toUpperCase() + String(status).slice(1) : "Updated";
      void sendMail({
        to: booking.customerEmail,
        subject: `Your booking has been updated — ${statusLabel}`,
        html: emailLayout(`Hi ${booking.customerName}, your booking is now: ${statusLabel}`, `
          ${bookingSummary(booking)}
          ${driverAssigned ? `
            <p style="background:#f4f4f5;padding:12px;border-radius:8px;">
              <strong>Your driver details:</strong><br/>
              ${booking.driverName ? `Driver: ${booking.driverName}<br/>` : ""}
              ${booking.driverPhone ? `Phone: ${booking.driverPhone}<br/>` : ""}
              ${booking.taxiNumber ? `Taxi: ${booking.taxiNumber}` : ""}
            </p>` : ""}
          <p>— AliTaxis Norwich</p>
        `),
      });
    }

    return NextResponse.json(toPlain(booking));
  } catch (error) {
    console.error("PATCH /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
