import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import { getSession } from "@/lib/auth";

export const defaultContent = {
  hero: {
    title: "AliTaxis Norwich",
    subtitle: "Premium Airport Transfers & Taxi Service",
    description: "Professional, reliable taxi service covering all major UK airports from Norwich. Fixed prices, no hidden fees.",
    phone: "07700 000000",
    email: "info@alitaxis.com",
  },
  airports: [
    { name: "Heathrow Airport", code: "LHR", distance: 120, basePrice: 150, estimatedTime: "2h 15m", image: "/airports/heathrow.jpg" },
    { name: "Gatwick Airport",  code: "LGW", distance: 130, basePrice: 160, estimatedTime: "2h 30m", image: "/airports/gatwick.jpg"  },
    { name: "Stansted Airport", code: "STN", distance: 65,  basePrice: 80,  estimatedTime: "1h 15m", image: "/airports/stansted.jpg" },
    { name: "Luton Airport",    code: "LTN", distance: 95,  basePrice: 110, estimatedTime: "1h 45m", image: "/airports/luton.jpg"    },
    { name: "Manchester Airport",code:"MAN", distance: 210, basePrice: 260, estimatedTime: "3h 30m", image: "/airports/manchester.jpg"},
  ],
  vehicles: [
    { id: "economy",   name: "Economy",   description: "Comfortable saloon for budget-conscious travellers", capacity: 4, luggage: 2, pricePerMile: 1.8, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0729?w=400&q=80", badge: "Best Value" },
    { id: "standard",  name: "Standard",  description: "Spacious saloon with extra legroom & comfort",       capacity: 4, luggage: 3, pricePerMile: 2.2, image: "https://images.unsplash.com/photo-1605559424843-9073c6e102c6?w=400&q=80", badge: "Popular"    },
    { id: "executive", name: "Executive", description: "Premium vehicle for business travellers",            capacity: 4, luggage: 3, pricePerMile: 3.0, image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&q=80", badge: "Business"   },
    { id: "mpv",       name: "MPV",       description: "Ideal for families, groups & extra luggage",        capacity: 6, luggage: 5, pricePerMile: 3.5, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80", badge: "Groups"     },
  ],
  services: [
    { title: "Airport Transfers",  description: "Reliable, punctual transfers to Heathrow, Gatwick, Stansted & Luton with flight monitoring included.", icon: "Plane"      },
    { title: "Long Distance",      description: "Comfortable travel to any destination across the UK. Fixed prices, no surprises.",                       icon: "MapPin"     },
    { title: "24/7 Available",     description: "Day or night, weekends or bank holidays — we're always here when you need us.",                          icon: "Clock"      },
    { title: "Safe & Licensed",    description: "All drivers are DBS checked, fully licensed and insured for your complete peace of mind.",               icon: "Shield"     },
    { title: "Fixed Prices",       description: "The price quoted is the price you pay. No hidden charges, no surge pricing.",                            icon: "CreditCard" },
    { title: "5-Star Rated",       description: "Consistently rated 5 stars by hundreds of satisfied customers across Norwich.",                          icon: "Star"       },
  ],
  contact: {
    phone: "07700 000000",
    email: "info@alitaxis.com",
    address: "Norwich, Norfolk, UK",
    hours: "24/7 — Always Available",
  },
  footer: {
    tagline: "Norwich's most trusted taxi and airport transfer service.",
    copyright: "© 2024 AliTaxis Norwich. All rights reserved.",
  },
};

// GET — public, returns all site content
export async function GET() {
  try {
    await connectDB();
    const docs = await SiteContent.find({}).lean() as any[];
    const content: Record<string, unknown> = { ...defaultContent };
    for (const doc of docs) {
      content[doc.key] = doc.data;
    }
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: defaultContent });
  }
}

// PATCH — admin only, update a section
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const { key, data } = await req.json();
    if (!key || !data) return NextResponse.json({ error: "key and data required" }, { status: 400 });

    await SiteContent.findOneAndUpdate(
      { key },
      { key, data },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Content update error:", err);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
