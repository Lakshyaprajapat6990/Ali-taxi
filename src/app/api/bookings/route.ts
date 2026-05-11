import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all bookings
export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      pickupLocation,
      dropoffLocation,
      pickupDate,
      pickupTime,
      passengers,
      luggage,
      vehicleType,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
    } = body;

    // Calculate estimated price based on vehicle type and route
    const vehiclePrices: Record<string, number> = {
      economy: 1.8,
      standard: 2.2,
      executive: 3.0,
      mpv: 3.5,
    };

    const airportRoutes: Record<string, { distance: number; basePrice: number }> = {
      "stansted": { distance: 65, basePrice: 80 },
      "gatwick": { distance: 130, basePrice: 160 },
      "heathrow": { distance: 120, basePrice: 150 },
      "luton": { distance: 95, basePrice: 110 },
      "manchester": { distance: 180, basePrice: 220 },
    };

    let estimatedPrice = 50; // Base price

    // Check if it's an airport route
    const dropoffLower = dropoffLocation.toLowerCase();
    for (const [airport, route] of Object.entries(airportRoutes)) {
      if (dropoffLower.includes(airport)) {
        const vehiclePricePerMile = vehiclePrices[vehicleType] || 2.2;
        estimatedPrice = Math.round(route.basePrice * (vehiclePricePerMile / 2));
        break;
      }
    }

    const booking = await db.booking.create({
      data: {
        pickupLocation,
        dropoffLocation,
        pickupDate,
        pickupTime,
        passengers: parseInt(passengers),
        luggage: parseInt(luggage),
        vehicleType,
        customerName,
        customerEmail,
        customerPhone,
        specialRequests: specialRequests || null,
        price: estimatedPrice,
        status: "pending",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
