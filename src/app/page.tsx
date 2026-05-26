"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Luggage,
  Plane,
  Shield,
  CreditCard,
  Star,
  Menu,
  X,
  CheckCircle,
  ArrowRight,
  Calendar,
  Timer,
} from "lucide-react";
import "./page.css";

const defaultContent = {
  hero: {
    title: "AliTaxis Norwich",
    subtitle: "Premium Airport Transfers & Taxi Service",
    description: "Your reliable partner for long-distance taxi services and airport transfers. Travel in comfort from Norwich to anywhere in the UK.",
    phone: "077 XXX XXXXXX",
    email: "Alixxxxxxxxxxxx@gmail.com",
  },
  airports: [
    { name: "Heathrow Airport",  code: "LHR", distance: 142, basePrice: 250, estimatedTime: "2h 15m", image: "/airports/heathrow.jpg"  },
    { name: "Gatwick Airport",   code: "LGW", distance: 145, basePrice: 270, estimatedTime: "2h 30m", image: "/airports/gatwick.jpg"   },
    { name: "Stansted Airport",  code: "STN", distance: 90,  basePrice: 160, estimatedTime: "1h 15m", image: "/airports/stansted.jpg"  },
    { name: "Luton Airport",     code: "LTN", distance: 99,  basePrice: 210, estimatedTime: "1h 45m", image: "/airports/luton.jpg"     },
    { name: "Manchester Airport",code: "MAN", distance: 237, basePrice: 410, estimatedTime: "3h 30m", image: "/airports/manchester.jpg"},
  ],
  vehicles: [
    { id: "economy",   name: "Economy",   description: "Comfortable saloon for budget-conscious travellers", capacity: 4, luggage: 2, pricePerMile: 1.8, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0729?w=400&q=80", badge: "Best Value" },
    { id: "standard",  name: "Standard",  description: "Spacious saloon with extra legroom & comfort",       capacity: 4, luggage: 3, pricePerMile: 2.2, image: "https://images.unsplash.com/photo-1605559424843-9073c6e102c6?w=400&q=80", badge: "Popular"    },
    { id: "executive", name: "Executive", description: "Premium vehicle for business travellers",            capacity: 4, luggage: 3, pricePerMile: 3.0, image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&q=80", badge: "Business"   },
    { id: "mpv",       name: "MPV",       description: "Ideal for families, groups & extra luggage",        capacity: 6, luggage: 5, pricePerMile: 3.5, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80", badge: "Groups"     },
  ],
  services: [
    { title: "Airport Transfers", description: "Reliable, punctual transfers to Heathrow, Gatwick, Stansted & Luton with flight monitoring included.", icon: "Plane"       },
    { title: "Long Distance",     description: "Comfortable travel to any destination across the UK. Fixed prices, no surprises.",                      icon: "MapPin"      },
    { title: "24/7 Available",    description: "Day or night, weekends or bank holidays — we're always here when you need us.",                         icon: "Clock"       },
    { title: "Safe & Licensed",   description: "All drivers are DBS checked, fully licensed and insured for your complete peace of mind.",              icon: "Shield"      },
    { title: "Fixed Prices",      description: "The price quoted is the price you pay. No hidden charges, no surge pricing.",                           icon: "CreditCard"  },
    { title: "5-Star Rated",      description: "Consistently rated 5 stars by hundreds of satisfied customers across Norwich.",                         icon: "Star"        },
  ],
  contact: {
    phone: "077 XXX XXXXXX",
    email: "Alixxxxxxxxxxxx@gmail.com",
    address: "Norwich, UK",
    hours: "24/7 Available",
  },
  footer: {
    tagline: "Your trusted partner for long-distance taxi services and airport transfers from Norwich.",
    copyright: `© ${new Date().getFullYear()} AliTaxis Norwich. All rights reserved.`,
  },
};

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  Plane: <Plane />, MapPin: <MapPin />, Clock: <Clock />,
  Shield: <Shield />, CreditCard: <CreditCard />, Star: <Star />,
};

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen]           = useState(false);
  const [isBookingOpen, setIsBookingOpen]     = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [activeSection, setActiveSection]     = useState("home");
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [bookingSuccess, setBookingSuccess]   = useState(false);
  const [cms, setCms]                         = useState(defaultContent);

  const openBooking = () => {
    if (!user) { setShowLoginPrompt(true); return; }
    setIsBookingOpen(true);
    captureLocation();
  };

  // Auth state
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);

  // Location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "fetching" | "got" | "denied">("idle");

  const [bookingForm, setBookingForm] = useState({
    pickupLocation: "", dropoffLocation: "", pickupDate: "", pickupTime: "",
    passengers: "1", luggage: "0", vehicleType: "standard",
    customerName: "", customerEmail: "", customerPhone: "", specialRequests: "",
  });

  // Fetch current session on mount
  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user) {
        setUser(d.user);
        setBookingForm(f => ({
          ...f,
          customerName: d.user.name || "",
          customerEmail: d.user.email || "",
          customerPhone: d.user.phone || "",
        }));
      }
    }).catch(() => {});

    // Fetch all site content from CMS
    fetch("/api/content").then(r => r.json()).then(d => {
      if (d.content) {
        setCms(prev => ({ ...prev, ...d.content }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "book", "airports", "services", "contact"];
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  };

  // Capture live geolocation when booking dialog opens
  const captureLocation = () => {
    if (!navigator.geolocation) return;
    setLocationStatus("fetching");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Reverse geocode using nominatim (free, no API key)
        let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const d = await r.json();
          if (d.display_name) address = d.display_name;
        } catch {}
        setUserLocation({ lat, lng, address });
        setLocationStatus("got");
        // Auto-fill pickup location if empty
        setBookingForm(f => ({ ...f, pickupLocation: f.pickupLocation || address }));
      },
      () => setLocationStatus("denied"),
      { timeout: 8000 }
    );
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingForm,
          locationLat:     userLocation?.lat     ?? null,
          locationLng:     userLocation?.lng     ?? null,
          locationAddress: userLocation?.address ?? null,
        }),
      });
      if (res.ok) {
        setBookingSuccess(true);
        setBookingForm({ pickupLocation: "", dropoffLocation: "", pickupDate: "", pickupTime: "",
          passengers: "1", luggage: "0", vehicleType: "standard",
          customerName: user?.name || "", customerEmail: user?.email || "", customerPhone: "", specialRequests: "" });
        setUserLocation(null);
        setLocationStatus("idle");
        setTimeout(() => { setBookingSuccess(false); setIsBookingOpen(false); }, 3000);
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAirportBooking = (airportName: string) => {
    if (!user) { setShowLoginPrompt(true); return; }
    setBookingForm(prev => ({ ...prev, dropoffLocation: airportName }));
    setIsBookingOpen(true);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "book", label: "Book Taxi" },
    { id: "services", label: "Services" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="page">

      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="headerInner">
          <div className="headerRow">

            {/* Logo */}
            <div className="logo">
              <div className="logoIcon"><Plane /></div>
              <div className="logoText">
                <h1 className="logoTitle">ALITAXIS</h1>
                <p className="logoSub">NORWICH</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="desktopNav">
              {[{ id: "home", label: "Home" }, { id: "book", label: "Book Taxi" }].map(item => (
                <button key={item.id} onClick={() => scrollToSection(item.id)}
                  className={activeSection === item.id ? "navBtnActive navBtn" : "navBtn"}>
                  {item.label}
                </button>
              ))}

              {/* Airport Transfers dropdown */}
              <div className="dropdownWrap">
                <button onClick={() => scrollToSection("airports")}
                  className={activeSection === "airports" ? "dropdownBtnActive dropdownBtn" : "dropdownBtn"}>
                  🛫 Airport Transfers
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="dropdownMenu">
                  {cms.airports.map(a => (
                    <button key={a.code} className="dropdownItem" onClick={() => openAirportBooking(a.name)}>{a.name}</button>
                  ))}
                </div>
              </div>

              {[{ id: "services", label: "Services" }, { id: "contact", label: "Contact" }].map(item => (
                <button key={item.id} onClick={() => scrollToSection(item.id)}
                  className={activeSection === item.id ? "navBtnActive navBtn" : "navBtn"}>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="headerRight">
              <a href={`tel:${cms.contact.phone}`} className="headerPhone">
                <Phone /> <span>{cms.contact.phone}</span>
              </a>
              {user ? (
                <div className="headerUserWrap">
                  <a href="/dashboard" className="headerUserBtn">
                    <div className="headerUserAvatar">{user.name.charAt(0).toUpperCase()}</div>
                    <span>{user.name.split(" ")[0]}</span>
                  </a>
                  <button className="headerLogoutBtn" onClick={handleLogout}>Sign Out</button>
                </div>
              ) : (
                <a href="/login" className="headerLoginBtn">Sign In</a>
              )}
              <button className="btnYellow" onClick={openBooking}>Book Now</button>
            </div>

            {/* Mobile menu toggle */}
            <button className="mobileMenuBtn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="mobileNav">
            <nav className="mobileNavInner">
              {[...navItems.slice(0, 2), { id: "airports", label: "Airport Transfers" }, ...navItems.slice(2)].map(item => (
                <button key={item.id} onClick={() => scrollToSection(item.id)}
                  className={activeSection === item.id ? "mobileNavBtn mobileNavBtnActive" : "mobileNavBtn"}>
                  {item.label}
                </button>
              ))}
              <div className="mobileNavFooter">
                <a href={`tel:${cms.contact.phone}`} className="mobileNavPhone"><Phone /><span>{cms.contact.phone}</span></a>
                <button className="btnYellow mobileBookBtn" onClick={() => { setIsMenuOpen(false); openBooking(); }}>
                  Book Now
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section id="home" className="hero">
        <div className="heroBg">
          <div className="heroBgImg" />
          <div className="heroBgOverlay" />
        </div>

        <div className="heroContent">
          <div className="heroGrid">

            {/* Left */}
            <div className="heroLeft">
              <span className="heroBadge">Norwich's Trusted Taxi Service</span>
              <h1 className="heroTitle">
                <span className="heroTitleYellow">ALITAXIS</span>
                <span className="heroTitleWhite">NORWICH</span>
              </h1>
              <p className="heroDesc">{cms.hero.description}</p>
              <div className="heroBadges">
                <span className="heroBadgePill"><Clock />24/7 Available</span>
                <span className="heroBadgePill"><Shield />Licensed & Insured</span>
                <span className="heroBadgePill"><CreditCard />Fixed Prices</span>
              </div>
              <div className="heroCtas">
                <button className="btnYellowLg" onClick={openBooking}>
                  Book Your Ride <ArrowRight />
                </button>
                <a href={`tel:${cms.contact.phone}`} className="btnOutlineLg">
                  <Phone /> Call Now
                </a>
              </div>
            </div>

            {/* Middle */}
            <div className="heroMiddle">
              <div className="heroMiddleIcon">
                <div className="heroMiddleIconCircle"><Plane /></div>
              </div>
              <h2 className="heroMiddleTitle">AIRPORT TRANSFERS</h2>
              <p className="heroMiddleDesc">
                Reliable transfers to all major UK airports — Heathrow, Gatwick, Stansted & Luton.
              </p>
              <div className="airportGrid">
                {cms.airports.map(airport => (
                  <div key={airport.code} className="airportCard">
                    <p className="airportCardName">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                      {airport.name.replace(" Airport", "")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Quick Quote */}
            <div className="heroRight">
              <div className="quoteCard">
                <h3 className="quoteTitle">Request Quote</h3>
                <p className="quoteSubtitle">Send us your trip details and we'll get back to you with the best price.</p>
                <div className="quoteForm">
                  <div>
                    <label className="quoteLabel">Pickup Location</label>
                    <div className="quoteInputWrap">
                      <svg className="quoteInputIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      <input className="quoteInputIcon-input" placeholder="Enter pickup address"
                        value={bookingForm.pickupLocation}
                        onChange={e => setBookingForm({ ...bookingForm, pickupLocation: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="quoteLabel">Dropoff Location</label>
                    <div className="quoteInputWrap">
                      <svg className="quoteInputIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      <input className="quoteInputIcon-input" placeholder="Enter destination"
                        value={bookingForm.dropoffLocation}
                        onChange={e => setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="quoteLabel">Your Contact (Email or Phone)</label>
                    <div className="quoteInputWrap">
                      <svg className="quoteInputIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <input className="quoteInputIcon-input" placeholder="Enter email or phone number"
                        value={bookingForm.customerPhone}
                        onChange={e => setBookingForm({ ...bookingForm, customerPhone: e.target.value })} />
                    </div>
                  </div>
                  <div className="quoteRow">
                    <div>
                      <label className="quoteLabel">Date</label>
                      <input type="date" className="quoteInput"
                        value={bookingForm.pickupDate}
                        onChange={e => setBookingForm({ ...bookingForm, pickupDate: e.target.value })} />
                    </div>
                    <div>
                      <label className="quoteLabel">Time</label>
                      <input type="time" className="quoteInput"
                        value={bookingForm.pickupTime}
                        onChange={e => setBookingForm({ ...bookingForm, pickupTime: e.target.value })} />
                    </div>
                  </div>
                  <button className="quoteSubmitBtn" onClick={openBooking}>
                    Get Quote & Book
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="scrollIndicator">
          <div className="scrollDot"><div className="scrollDotInner" /></div>
        </div>
      </section>

      {/* ===== BOOK TAXI ===== */}
      <section id="book" className="sectionDark">
        <div className="sectionInner">
          <div className="sectionHeader">
            <span className="sectionTag">Book a Ride</span>
            <h2 className="sectionTitle"><span className="sectionTitleYellow">Book</span> Your Taxi</h2>
            <p className="sectionDesc">Fill in your journey details and we'll provide you with an instant quote. Long-distance travel made easy.</p>
          </div>

          <div className="vehicleGrid">
            {cms.vehicles.map(v => (
              <div key={v.id}
                className={bookingForm.vehicleType === v.id ? "vehicleCard vehicleCardActive" : "vehicleCard"}
                onClick={() => setBookingForm({ ...bookingForm, vehicleType: v.id })}>
                {v.badge && <span className="vehicleBadge">{v.badge}</span>}
                <div className="vehicleImgWrap">
                  <img src={v.image} alt={v.name} className="vehicleImg" />
                  <div className="vehicleImgOverlay" />
                </div>
                <div className="vehicleCardBody">
                  <h3 className="vehicleName">{v.name}</h3>
                  <p className="vehicleDesc">{v.description}</p>
                  <div className="vehicleMeta">
                    <span className="vehicleMetaItem"><Users /><span>{v.capacity} Passengers</span></span>
                    <span className="vehicleMetaItem"><Luggage /><span>{v.luggage} Bags</span></span>
                  </div>
                  <p className="vehiclePrice">£{v.pricePerMile.toFixed(2)}<span className="vehiclePriceSub">/mile</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile form */}
          <div className="mobileForm">
            <div className="formCard">
              <div className="formGroup">
                <label className="formLabel">Pickup Location</label>
                <input className="formInput" placeholder="Enter pickup address"
                  value={bookingForm.pickupLocation}
                  onChange={e => setBookingForm({ ...bookingForm, pickupLocation: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="formLabel">Dropoff Location</label>
                <input className="formInput" placeholder="Enter destination"
                  value={bookingForm.dropoffLocation}
                  onChange={e => setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })} />
              </div>
              <div className="formRow" style={{ marginBottom: 16 }}>
                <div>
                  <label className="formLabel">Date</label>
                  <input type="date" className="formInput"
                    value={bookingForm.pickupDate}
                    onChange={e => setBookingForm({ ...bookingForm, pickupDate: e.target.value })} />
                </div>
                <div>
                  <label className="formLabel">Time</label>
                  <input type="time" className="formInput"
                    value={bookingForm.pickupTime}
                    onChange={e => setBookingForm({ ...bookingForm, pickupTime: e.target.value })} />
                </div>
              </div>
              <button className="btnYellowLg" style={{ width: "100%", justifyContent: "center" }}
                onClick={openBooking}>
                Complete Booking <ArrowRight />
              </button>
            </div>
          </div>

          {/* Desktop info cards */}
          <div className="infoGrid">
            <div className="infoCard"><Calendar /><h3 className="infoCardTitle">Easy Booking</h3><p className="infoCardDesc">Book online or call us. We'll confirm your ride within minutes.</p></div>
            <div className="infoCard"><Shield /><h3 className="infoCardTitle">Safe & Reliable</h3><p className="infoCardDesc">All drivers are DBS checked and vehicles are regularly maintained.</p></div>
            <div className="infoCard"><CreditCard /><h3 className="infoCardTitle">Fixed Pricing</h3><p className="infoCardDesc">No hidden charges. The price you see is the price you pay.</p></div>
          </div>
        </div>
      </section>

      {/* ===== AIRPORTS ===== */}
      <section id="airports" className="sectionBlack">
        <div className="sectionInner">
          <div className="sectionHeader">
            <span className="airportSectionBadge">Airport Transfers</span>
            <h2 className="sectionTitle"><span className="sectionTitleYellow">Airport</span> Transfer Services</h2>
            <p className="sectionDesc">Reliable transfers from Norwich to all major UK airports. We monitor your flight and adjust pickup time at no extra cost.</p>
          </div>

          <div className="airportCards">
            {cms.airports.map(airport => (
              <div key={airport.code} className="airportSectionCard">
                <div className="airportImgWrap">
                  <img src={airport.image} alt={airport.name} className="airportImg" />
                  <div className="airportImgOverlay" />
                  <span className="airportBadge">{airport.code}</span>
                  <div className="airportPlaneIcon"><Plane /></div>
                </div>
                <div className="airportCardBody">
                  <h3 className="airportCardTitle">{airport.name}</h3>
                  <div className="airportCardMeta">
                    <span className="airportCardMetaItem"><MapPin />{airport.distance} miles</span>
                    <span className="airportCardMetaItem"><Timer />{airport.estimatedTime}</span>
                  </div>
                  <div className="airportCardFooter">
                    <div>
                      <p className="airportFromLabel">From</p>
                      <p className="airportFromPrice">£{airport.basePrice}</p>
                    </div>
                    <button className="btnYellow" onClick={() => openAirportBooking(airport.name)}>Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flightMonitorBox">
            <div className="flightMonitorCard">
              <div className="flightMonitorInner">
                <div className="flightMonitorIcon"><CheckCircle /></div>
                <div className="flightMonitorText">
                  <h4 className="flightMonitorTitle">Flight Monitoring Included</h4>
                  <p className="flightMonitorDesc">We track your flight and adjust pickup time for delays - no extra charge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="sectionDark">
        <div className="sectionInner">
          <div className="sectionHeader">
            <span className="sectionTag">Why Us</span>
            <h2 className="sectionTitle">Why <span className="sectionTitleYellow">Choose</span> Us</h2>
            <p className="sectionDesc">We're committed to providing the best taxi service in Norwich. Here's what makes us different.</p>
          </div>

          <div className="servicesGrid">
            {cms.services.map((s, i) => (
              <div key={i} className="serviceCard">
                <div className="serviceIconWrap">{SERVICE_ICONS[s.icon] ?? <Star />}</div>
                <h3 className="serviceTitle">{s.title}</h3>
                <p className="serviceDesc">{s.description}</p>
              </div>
            ))}
          </div>

          <h2 className="testimonialsTitle">What Our <span className="sectionTitleYellow">Customers</span> Say</h2>
          <div className="testimonialsGrid">
            {[
              { name: "Sarah M.", text: "Excellent service! Driver was on time and very professional. Will definitely use again.", rating: 5 },
              { name: "John D.",  text: "Best airport transfer service in Norwich. Fixed prices and clean vehicles.", rating: 5 },
              { name: "Emily R.", text: "Used Alitaxis for my trip to Heathrow. Smooth journey and great value for money.", rating: 5 },
            ].map((t, i) => (
              <div key={i} className="testimonialCard">
                <div className="testimonialStars">{[...Array(t.rating)].map((_, j) => <Star key={j} />)}</div>
                <p className="testimonialText">"{t.text}"</p>
                <p className="testimonialName">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="sectionBlack">
        <div className="sectionInner">
          <div className="contactGrid">
            <div>
              <h2 className="contactTitle"><span className="sectionTitleYellow">Contact</span> Us</h2>
              <p className="contactDesc">Have questions or need a quote? Get in touch with us. We're available 24/7.</p>
              <div className="contactItems">
                <div className="contactItem">
                  <div className="contactItemIcon"><Phone /></div>
                  <div>
                    <p className="contactItemLabel">Phone</p>
                    <a href={`tel:${cms.contact.phone}`} className="contactItemValue">{cms.contact.phone}</a>
                  </div>
                </div>
                <div className="contactItem">
                  <div className="contactItemIcon"><Mail /></div>
                  <div>
                    <p className="contactItemLabel">Email</p>
                    <a href={`mailto:${cms.contact.email}`} className="contactItemValue">{cms.contact.email}</a>
                  </div>
                </div>
                <div className="contactItem">
                  <div className="contactItemIcon"><MapPin /></div>
                  <div>
                    <p className="contactItemLabel">Location</p>
                    <p className="contactItemValue">{cms.contact.address}</p>
                  </div>
                </div>
                <div className="contactItem">
                  <div className="contactItemIcon"><Clock /></div>
                  <div>
                    <p className="contactItemLabel">Hours</p>
                    <p className="contactItemValue">{cms.contact.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="contactFormCard">
                <h3 className="contactFormTitle">Send us a Message</h3>
                <form className="contactForm">
                  <div>
                    <label className="formLabel">Name</label>
                    <input className="contactInput" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="formLabel">Email</label>
                    <input type="email" className="contactInput" placeholder="Your email" />
                  </div>
                  <div>
                    <label className="formLabel">Phone</label>
                    <input className="contactInput" placeholder="Your phone number" />
                  </div>
                  <div>
                    <label className="formLabel">Message</label>
                    <textarea className="contactTextarea" placeholder="How can we help you?" rows={4} />
                  </div>
                  <button type="submit" className="btnYellowLg" style={{ justifyContent: "center", width: "100%" }}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footerInner">
          <div className="footerGrid">
            <div>
              <div className="footerLogo">
                <div className="footerLogoIcon"><Plane /></div>
                <div>
                  <p className="footerLogoName">ALITAXIS</p>
                  <p className="footerLogoSub">NORWICH</p>
                </div>
              </div>
              <p className="footerDesc">{cms.footer.tagline}</p>
            </div>

            <div>
              <h4 className="footerHeading">Quick Links</h4>
              <ul className="footerList">
                {["Home", "Book Taxi", "Airport Transfers", "Services", "Contact"].map(link => (
                  <li key={link}>
                    <button className="footerLink"
                      onClick={() => scrollToSection(link.toLowerCase().replace(/ /g, "").replace("transfers", "ports"))}>
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="footerHeading">Airport Transfers</h4>
              <ul className="footerList">
                {cms.airports.map(a => (
                  <li key={a.code}>
                    <button className="footerLink" onClick={() => openAirportBooking(a.name)}>{a.name}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="footerHeading">Contact</h4>
              <ul className="footerList">
                <li className="footerContactItem"><Phone /><span>{cms.contact.phone}</span></li>
                <li className="footerContactItem"><Mail /><span>{cms.contact.email}</span></li>
                <li className="footerContactItem"><MapPin /><span>{cms.contact.address}</span></li>
              </ul>
            </div>
          </div>

          <div className="footerBottom">
            <p className="footerCopy">{cms.footer.copyright}</p>
            <div className="footerBottomRight">
              <span>Licensed & Insured</span>
              <span className="footerBottomDot" />
              <span>24/7 Available</span>
              <span className="footerBottomDot" />
              <span>Fixed Prices</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== LOGIN REQUIRED POPUP ===== */}
      {showLoginPrompt && (
        <div className="dialogOverlay" onClick={e => e.target === e.currentTarget && setShowLoginPrompt(false)}>
          <div className="dialogBox" style={{ maxWidth: 420, textAlign: "center", padding: "48px 36px" }}>
            <button className="dialogClose" onClick={() => setShowLoginPrompt(false)}><X /></button>
            <div style={{ width: 64, height: 64, background: "rgba(234,179,8,0.15)", border: "2px solid rgba(234,179,8,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Shield style={{ width: 28, height: 28, color: "#eab308" }} />
            </div>
            <h2 className="dialogTitle" style={{ fontSize: "1.6rem", marginBottom: 10 }}>Login <span>Required</span></h2>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 32 }}>
              Please sign in or create an account to book your taxi. It only takes a minute!
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <a href="/login" className="btnYellowLg" style={{ textDecoration: "none", padding: "12px 28px", fontSize: "1rem" }}>
                Sign In
              </a>
              <a href="/register" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 8, border: "2px solid #eab308", color: "#eab308", fontWeight: 700, fontSize: "1rem", textDecoration: "none", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(234,179,8,0.1)") }
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Register
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===== BOOKING DIALOG ===== */}
      {isBookingOpen && (
        <div className="dialogOverlay" onClick={e => e.target === e.currentTarget && setIsBookingOpen(false)}>
          <div className="dialogBox">
            <button className="dialogClose" onClick={() => setIsBookingOpen(false)}><X /></button>

            <h2 className="dialogTitle">Complete Your <span>Booking</span></h2>
            <p className="dialogSubtitle">Fill in your details below to confirm your taxi booking</p>

            {/* Live location banner */}
            <div className="locationBanner">
              <div className="locationBannerLeft">
                <MapPin size={16} />
                <div>
                  <p className="locationBannerTitle">
                    {locationStatus === "got" ? "Live location captured" :
                     locationStatus === "fetching" ? "Detecting your location…" :
                     locationStatus === "denied" ? "Location access denied" :
                     "Use your live location for pickup"}
                  </p>
                  {locationStatus === "got" && userLocation && (
                    <p className="locationBannerAddr">{userLocation.address.slice(0, 60)}…</p>
                  )}
                </div>
              </div>
              {locationStatus === "idle" || locationStatus === "denied" ? (
                <button type="button" className="locationBannerBtn" onClick={captureLocation}>
                  {locationStatus === "denied" ? "Retry" : "Detect"}
                </button>
              ) : locationStatus === "got" ? (
                <CheckCircle size={18} color="#22c55e" />
              ) : (
                <div className="locationSpinner" />
              )}
            </div>

            {bookingSuccess ? (
              <div className="successBox">
                <div className="successIcon"><CheckCircle /></div>
                <h3 className="successTitle">Booking Confirmed!</h3>
                <p className="successDesc">We'll send you a confirmation email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="bookingForm">
                <div className="bookingSection">
                  <h4 className="bookingSectionTitle">Journey Details</h4>
                  <div className="bookingGrid2">
                    <div>
                      <label className="formLabel">Pickup Location</label>
                      <input required className="bookingInput" placeholder="e.g., Norwich City Centre"
                        value={bookingForm.pickupLocation}
                        onChange={e => setBookingForm({ ...bookingForm, pickupLocation: e.target.value })} />
                    </div>
                    <div>
                      <label className="formLabel">Dropoff Location</label>
                      <input required className="bookingInput" placeholder="e.g., Stansted Airport"
                        value={bookingForm.dropoffLocation}
                        onChange={e => setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })} />
                    </div>
                  </div>
                  <div className="bookingGrid2">
                    <div>
                      <label className="formLabel">Pickup Date</label>
                      <input required type="date" className="bookingInput"
                        value={bookingForm.pickupDate}
                        onChange={e => setBookingForm({ ...bookingForm, pickupDate: e.target.value })} />
                    </div>
                    <div>
                      <label className="formLabel">Pickup Time</label>
                      <input required type="time" className="bookingInput"
                        value={bookingForm.pickupTime}
                        onChange={e => setBookingForm({ ...bookingForm, pickupTime: e.target.value })} />
                    </div>
                  </div>
                  <div className="bookingGrid3">
                    <div>
                      <label className="formLabel">Passengers</label>
                      <select className="bookingSelect" value={bookingForm.passengers}
                        onChange={e => setBookingForm({ ...bookingForm, passengers: e.target.value })}>
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? "Passenger" : "Passengers"}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="formLabel">Luggage</label>
                      <select className="bookingSelect" value={bookingForm.luggage}
                        onChange={e => setBookingForm({ ...bookingForm, luggage: e.target.value })}>
                        {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? "Bag" : "Bags"}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="formLabel">Vehicle Type</label>
                      <select className="bookingSelect" value={bookingForm.vehicleType}
                        onChange={e => setBookingForm({ ...bookingForm, vehicleType: e.target.value })}>
                        {cms.vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bookingSection">
                  <h4 className="bookingSectionTitle">Your Details</h4>
                  <div className="bookingGrid2">
                    <div>
                      <label className="formLabel">Full Name</label>
                      <input required className="bookingInput" placeholder="Your name"
                        value={bookingForm.customerName}
                        onChange={e => setBookingForm({ ...bookingForm, customerName: e.target.value })} />
                    </div>
                    <div>
                      <label className="formLabel">Phone Number</label>
                      <input required type="tel" className="bookingInput" placeholder="Your phone number"
                        value={bookingForm.customerPhone}
                        onChange={e => setBookingForm({ ...bookingForm, customerPhone: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="formLabel">Email Address</label>
                    <input required type="email" className="bookingInput" placeholder="Your email"
                      value={bookingForm.customerEmail}
                      onChange={e => setBookingForm({ ...bookingForm, customerEmail: e.target.value })} />
                  </div>
                  <div>
                    <label className="formLabel">Special Requests (Optional)</label>
                    <textarea className="bookingTextarea" placeholder="Any special requirements?"
                      value={bookingForm.specialRequests}
                      onChange={e => setBookingForm({ ...bookingForm, specialRequests: e.target.value })} />
                  </div>
                </div>

                <div className="priceEstimate">
                  <div className="priceEstimateRow">
                    <span className="priceEstimateLabel">Estimated Price</span>
                    <span className="priceEstimateValue">
                      £{(() => {
                        const v = cms.vehicles.find(v => v.id === bookingForm.vehicleType);
                        const a = cms.airports.find(a => bookingForm.dropoffLocation.toLowerCase().includes(a.name.toLowerCase()));
                        if (a && v) return Math.round(a.basePrice * (v.pricePerMile / 2));
                        return "—";
                      })()}
                    </span>
                  </div>
                  <p className="priceEstimateNote">Final price will be confirmed after booking review</p>
                </div>

                <button type="submit" className="bookingSubmitBtn" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
