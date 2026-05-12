"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Luggage,
  Car,
  Plane,
  Shield,
  Briefcase,
  Menu,
  X,
  CheckCircle,
  ArrowRight,
  Calendar,
  Timer,
  User,
  Send,
  ChevronDown,
} from "lucide-react";

// Vehicle types with pricing
const vehicleTypes = [
  {
    id: "economy",
    name: "Economy",
    description: "Comfortable sedan for budget-conscious travelers",
    capacity: 4,
    luggage: 2,
    pricePerMile: 1.8,
    icon: "🚗",
  },
  {
    id: "standard",
    name: "Standard",
    description: "Spacious sedan with extra legroom",
    capacity: 4,
    luggage: 3,
    pricePerMile: 2.2,
    icon: "🚕",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Premium sedan for business travelers",
    capacity: 4,
    luggage: 3,
    pricePerMile: 3.0,
    icon: "🚙",
  },
  {
    id: "mpv",
    name: "MPV",
    description: "Perfect for families and groups",
    capacity: 6,
    luggage: 5,
    pricePerMile: 3.5,
    icon: "🚐",
  },
];

// Airport routes - Only 4 airports as requested
const airportRoutes = [
  {
    name: "Heathrow Airport",
    code: "LHR",
    distance: 120,
    basePrice: 150,
    estimatedTime: "2h 15m",
    image: "/airports/heathrow.jpg",
  },
  {
    name: "Gatwick Airport",
    code: "LGW",
    distance: 130,
    basePrice: 160,
    estimatedTime: "2h 30m",
    image: "/airports/gatwick.jpg",
  },
  {
    name: "Stansted Airport",
    code: "STN",
    distance: 65,
    basePrice: 80,
    estimatedTime: "1h 15m",
    image: "/airports/stansted.jpg",
  },
  {
    name: "Luton Airport",
    code: "LTN",
    distance: 95,
    basePrice: 110,
    estimatedTime: "1h 45m",
    image: "/airports/luton.jpg",
  },
];

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isQuoteTabOpen, setIsQuoteTabOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    date: "",
    time: "",
    contact: "",
  });

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    passengers: "1",
    luggage: "0",
    vehicleType: "standard",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    specialRequests: "",
  });

  // Handle scroll for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "book", "airports", "services", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // Handle booking submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      if (response.ok) {
        setBookingSuccess(true);
        setBookingForm({
          pickupLocation: "",
          dropoffLocation: "",
          pickupDate: "",
          pickupTime: "",
          passengers: "1",
          luggage: "0",
          vehicleType: "standard",
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          specialRequests: "",
        });
        setTimeout(() => {
          setBookingSuccess(false);
          setIsBookingOpen(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open booking with airport pre-selected
  const openAirportBooking = (airportName: string) => {
    setBookingForm((prev) => ({
      ...prev,
      dropoffLocation: airportName,
    }));
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - ALITAXIS NORWICH (removed LTD) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFC107] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg sm:text-xl">A</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[#FFC107] tracking-wide">
                  ALITAXIS
                </h1>
                <p className="text-[10px] sm:text-xs text-white -mt-1">NORWICH</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {[
                { id: "home", label: "Home" },
                { id: "book", label: "Book Taxi" },
                { id: "airports", label: "Airport Transfers" },
                { id: "services", label: "Services" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-[#FFC107] ${
                    activeSection === item.id ? "text-[#FFC107]" : "text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Phone Number & CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:077XXXXXXXX"
                className="flex items-center gap-2 text-white font-medium hover:text-[#FFC107] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>077 XXX XXXXXXX</span>
              </a>
              <Button
                onClick={() => setIsBookingOpen(true)}
                className="bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold px-6 rounded-full"
              >
                Book Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-[#FFC107] p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 border-t border-white/10">
            <nav className="flex flex-col p-4 gap-2">
              {[
                { id: "home", label: "Home" },
                { id: "book", label: "Book Taxi" },
                { id: "airports", label: "Airport Transfers" },
                { id: "services", label: "Services" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left py-3 px-4 rounded-lg font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-[#FFC107]/10 text-[#FFC107]"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10">
                <a
                  href="tel:077XXXXXXXX"
                  className="flex items-center gap-2 text-white font-medium py-2 px-4"
                >
                  <Phone className="w-4 h-4" />
                  <span>077 XXX XXXXXXX</span>
                </a>
                <Button
                  onClick={() => {
                    setIsBookingOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold mt-2 rounded-full"
                >
                  Book Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Vertical Get Quote Tab - Fixed on right side */}
      <button
        onClick={() => setIsQuoteTabOpen(!isQuoteTabOpen)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#FFC107] text-black font-bold py-4 px-2 rounded-l-lg shadow-lg hover:bg-[#FFD54F] transition-colors lg:hidden"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        Get Quote
        <ChevronDown className="w-4 h-4 mt-2 rotate-[-90deg]" />
      </button>

      {/* Hero Section */}
      <section id="home" className="relative pt-16 sm:pt-20 min-h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="/hero-bg.jpg" 
            alt="Taxi at night"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left Column - Main Focus */}
            <div className="lg:col-span-3 text-center lg:text-left">
              {/* Main Headline - Big, Bold, Primary Focus */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-2 leading-none">
                <span className="text-[#FFC107]">AIRPORT</span>
              </h1>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-none">
                <span className="text-[#FFC107]">TRANSFERS</span>
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">
                & Airport Runs
              </h2>
              
              {/* Description - Focus on airport transfers */}
              <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                Reliable 24/7 airport transfers from Norwich to all major UK airports. 
                Professional drivers, comfortable vehicles, and fixed prices. 
                Travel in comfort. Arrive on time. Every time.
              </p>

              {/* Service Badges - Highlighted */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFC107] rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
                  </div>
                  <span className="text-xs sm:text-sm text-white font-medium">24/7 Available</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFC107] rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
                  </div>
                  <span className="text-xs sm:text-sm text-white font-medium">Licensed & Insured</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFC107] rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
                  </div>
                  <span className="text-xs sm:text-sm text-white font-medium">Fixed Prices</span>
                </div>
              </div>

              {/* CTA Buttons - Focus on call & booking */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  size="lg"
                  className="bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-full"
                >
                  Book Your Ride
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <a href="tel:077XXXXXXXX">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black font-bold text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-full border-0"
                  >
                    <Phone className="mr-2 w-5 h-5" />
                    Call Now
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Column - Compact Quote Form */}
            <div className="lg:col-span-2 hidden lg:block">
              <Card className="bg-[#1A1A1A]/90 border-white/10 backdrop-blur-sm">
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-[#FFC107] mb-1">
                    Request Quote
                  </h3>
                  <p className="text-gray-400 mb-4 text-xs">
                    Send us your trip details for a quick quote
                  </p>
                  <form className="space-y-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFC107]" />
                      <Input
                        placeholder="Pickup Location"
                        className="bg-[#333] border-white/10 text-white pl-9 h-10 text-sm focus:border-[#FFC107]"
                        value={enquiryForm.pickupLocation}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, pickupLocation: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFC107]" />
                      <Input
                        placeholder="Dropoff Location"
                        className="bg-[#333] border-white/10 text-white pl-9 h-10 text-sm focus:border-[#FFC107]"
                        value={enquiryForm.dropoffLocation}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, dropoffLocation: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        className="bg-[#333] border-white/10 text-white h-10 text-sm focus:border-[#FFC107]"
                        value={enquiryForm.date}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, date: e.target.value })
                        }
                      />
                      <Input
                        type="time"
                        className="bg-[#333] border-white/10 text-white h-10 text-sm focus:border-[#FFC107]"
                        value={enquiryForm.time}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, time: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFC107]" />
                      <Input
                        placeholder="Contact Number or Email"
                        className="bg-[#333] border-white/10 text-white pl-9 h-10 text-sm focus:border-[#FFC107]"
                        value={enquiryForm.contact}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, contact: e.target.value })
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => setIsBookingOpen(true)}
                      className="w-full bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold h-10 rounded-full text-sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Enquiry
                    </Button>
                  </form>
                  <p className="text-gray-500 text-center mt-3 text-xs">
                    Or call{" "}
                    <a href="tel:077XXXXXXXX" className="text-[#FFC107] hover:underline">
                      077 XXX XXXXXXX
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#FFC107]/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#FFC107] rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Mobile Quote Form - Slide from right */}
      {isQuoteTabOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/80"
            onClick={() => setIsQuoteTabOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#1A1A1A] p-6 overflow-y-auto">
            <button
              onClick={() => setIsQuoteTabOpen(false)}
              className="absolute top-4 right-4 text-[#FFC107]"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-[#FFC107] mb-1 mt-8">
              Request Quote
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Send us your trip details for a quick quote
            </p>
            <form className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFC107]" />
                <Input
                  placeholder="Pickup Location"
                  className="bg-[#333] border-white/10 text-white pl-9 h-11 focus:border-[#FFC107]"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFC107]" />
                <Input
                  placeholder="Dropoff Location"
                  className="bg-[#333] border-white/10 text-white pl-9 h-11 focus:border-[#FFC107]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  className="bg-[#333] border-white/10 text-white h-11 focus:border-[#FFC107]"
                />
                <Input
                  type="time"
                  className="bg-[#333] border-white/10 text-white h-11 focus:border-[#FFC107]"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFC107]" />
                <Input
                  placeholder="Contact Number or Email"
                  className="bg-[#333] border-white/10 text-white pl-9 h-11 focus:border-[#FFC107]"
                />
              </div>
              <Button
                type="button"
                onClick={() => {
                  setIsQuoteTabOpen(false);
                  setIsBookingOpen(true);
                }}
                className="w-full bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold h-11 rounded-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Enquiry
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Airport Transfers Section */}
      <section id="airports" className="py-16 sm:py-20 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <Badge className="bg-[#FFC107]/20 text-[#FFC107] border-[#FFC107]/30 mb-4">
              <Plane className="w-4 h-4 mr-2" />
              🛫 Airport Transfers
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              <span className="text-[#FFC107]">Heathrow</span>{" "}
              <span className="text-white">Airport</span>
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              <span className="text-[#FFC107]">Gatwick</span>{" "}
              <span className="text-white">Airport</span>
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              <span className="text-[#FFC107]">Stansted</span>{" "}
              <span className="text-white">Airport</span>
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              <span className="text-[#FFC107]">Luton</span>{" "}
              <span className="text-white">Airport</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Reliable airport transfers from Norwich to all major UK airports.
              We monitor flight times and adjust pickup accordingly.
            </p>
          </div>

          {/* Airport Cards - 4 airports only */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {airportRoutes.map((airport) => (
              <Card
                key={airport.code}
                className="bg-[#252525] border-white/10 hover:border-[#FFC107]/50 transition-all overflow-hidden group"
              >
                <div className="h-32 sm:h-40 relative overflow-hidden">
                  <img 
                    src={airport.image} 
                    alt={airport.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#FFC107] text-black font-bold">{airport.code}</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Plane className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFC107]" />
                  </div>
                </div>
                <CardContent className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{airport.name}</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFC107]" />
                      <span>{airport.distance} miles</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFC107]" />
                      <span>{airport.estimatedTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs">From</p>
                      <p className="text-xl sm:text-2xl font-bold text-[#FFC107]">
                        £{airport.basePrice}
                      </p>
                    </div>
                    <Button
                      onClick={() => openAirportBooking(airport.name)}
                      className="bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Flight Monitoring Note */}
          <div className="mt-10 sm:mt-12 text-center">
            <Card className="inline-block bg-[#FFC107]/10 border-[#FFC107]/30">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFC107] rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-base sm:text-lg font-bold text-white">
                      Flight Monitoring Included
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      We track your flight and adjust pickup time for delays - no extra charge
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Book Taxi Section */}
      <section id="book" className="py-16 sm:py-20 bg-[#252525]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Book</span>{" "}
              <span className="text-[#FFC107]">Your Taxi</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Choose your vehicle and fill in your journey details.
            </p>
          </div>

          {/* Vehicle Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {vehicleTypes.map((vehicle) => (
              <Card
                key={vehicle.id}
                className={`bg-[#1A1A1A] border-2 cursor-pointer transition-all hover:scale-105 ${
                  bookingForm.vehicleType === vehicle.id
                    ? "border-[#FFC107] shadow-lg shadow-[#FFC107]/20"
                    : "border-white/10"
                }`}
                onClick={() => setBookingForm({ ...bookingForm, vehicleType: vehicle.id })}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{vehicle.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
                    {vehicle.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                    {vehicle.description}
                  </p>
                  <div className="flex justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFC107]" />
                      <span>{vehicle.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Luggage className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFC107]" />
                      <span>{vehicle.luggage}</span>
                    </div>
                  </div>
                  <p className="text-[#FFC107] font-bold mt-3 sm:mt-4">
                    £{vehicle.pricePerMile.toFixed(2)}/mile
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setIsBookingOpen(true)}
              size="lg"
              className="bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold px-10 py-6 rounded-full"
            >
              Book Your Ride
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-20 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Why</span>{" "}
              <span className="text-[#FFC107]">Choose Us</span>
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: "24/7 Service",
                description: "Available round the clock",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Safe & Secure",
                description: "Licensed drivers, insured vehicles",
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                title: "Fixed Prices",
                description: "No hidden charges",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Professional",
                description: "Experienced drivers",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="bg-[#252525] border-white/10 hover:border-[#FFC107]/50 transition-all group"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFC107] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-black">{service.icon}</div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-[#252525]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
                <span className="text-white">Contact</span>{" "}
                <span className="text-[#FFC107]">Us</span>
              </h2>
              <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
                Have questions? Get in touch with us. We're available 24/7.
              </p>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFC107] rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Phone</p>
                    <a href="tel:077XXXXXXXX" className="text-white hover:text-[#FFC107] font-semibold text-sm sm:text-base">
                      077 XXX XXXXXXX
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFC107] rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Email</p>
                    <a href="mailto:Alixxxxxxxxxxxx@gmail.com" className="text-white hover:text-[#FFC107] font-semibold text-sm sm:text-base">
                      Alixxxxxxxxxxxx@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFC107] rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Location</p>
                    <p className="text-white font-semibold text-sm sm:text-base">Norwich, UK</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="bg-[#1A1A1A] border-white/10">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                    Send us a Message
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Name</Label>
                      <Input placeholder="Your name" className="bg-[#333] border-white/10 text-white mt-1 h-11" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Email</Label>
                      <Input type="email" placeholder="Your email" className="bg-[#333] border-white/10 text-white mt-1 h-11" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Phone</Label>
                      <Input placeholder="Your phone number" className="bg-[#333] border-white/10 text-white mt-1 h-11" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Message</Label>
                      <Textarea
                        placeholder="How can we help you?"
                        className="bg-[#333] border-white/10 text-white mt-1"
                        rows={4}
                      />
                    </div>
                    <Button className="w-full bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold h-12 rounded-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FFC107] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm sm:text-base">A</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#FFC107]">ALITAXIS</h3>
                  <p className="text-xs text-white">NORWICH</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Your trusted partner for airport transfers from Norwich.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {["Home", "Book Taxi", "Airport Transfers", "Services", "Contact"].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollToSection(link.toLowerCase().replace(" ", ""))}
                      className="text-gray-400 hover:text-[#FFC107] transition-colors text-xs sm:text-sm"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Airport Transfers - Only 4 airports */}
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Airport Transfers</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {airportRoutes.map((airport) => (
                  <li key={airport.code}>
                    <button
                      onClick={() => openAirportBooking(airport.name)}
                      className="text-gray-400 hover:text-[#FFC107] transition-colors text-xs sm:text-sm"
                    >
                      {airport.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFC107]" />
                  <span>077 XXX XXXXXXX</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFC107]" />
                  <span className="break-all">Alixxxxxxxxxxxx@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFC107]" />
                  <span>Norwich, UK</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} Alitaxis Norwich. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#FFC107]">
              Book Your Ride
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in your details to confirm your booking
            </DialogDescription>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
              <p className="text-gray-400">
                We'll send you a confirmation email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Journey Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                  Journey Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Pickup Location</Label>
                    <Input
                      required
                      placeholder="e.g., Norwich City Centre"
                      className="bg-[#333] border-white/10 text-white mt-1 h-11"
                      value={bookingForm.pickupLocation}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, pickupLocation: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Dropoff Location</Label>
                    <Input
                      required
                      placeholder="e.g., Heathrow Airport"
                      className="bg-[#333] border-white/10 text-white mt-1 h-11"
                      value={bookingForm.dropoffLocation}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Pickup Date</Label>
                    <Input
                      required
                      type="date"
                      className="bg-[#333] border-white/10 text-white mt-1 h-11"
                      value={bookingForm.pickupDate}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, pickupDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Pickup Time</Label>
                    <Input
                      required
                      type="time"
                      className="bg-[#333] border-white/10 text-white mt-1 h-11"
                      value={bookingForm.pickupTime}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, pickupTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-300">Passengers</Label>
                    <Select
                      value={bookingForm.passengers}
                      onValueChange={(value) =>
                        setBookingForm({ ...bookingForm, passengers: value })
                      }
                    >
                      <SelectTrigger className="bg-[#333] border-white/10 text-white mt-1 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#333] border-white/10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Luggage</Label>
                    <Select
                      value={bookingForm.luggage}
                      onValueChange={(value) =>
                        setBookingForm({ ...bookingForm, luggage: value })
                      }
                    >
                      <SelectTrigger className="bg-[#333] border-white/10 text-white mt-1 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#333] border-white/10">
                        {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Vehicle</Label>
                    <Select
                      value={bookingForm.vehicleType}
                      onValueChange={(value) =>
                        setBookingForm({ ...bookingForm, vehicleType: value })
                      }
                    >
                      <SelectTrigger className="bg-[#333] border-white/10 text-white mt-1 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#333] border-white/10">
                        {vehicleTypes.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                  Your Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Full Name</Label>
                    <Input
                      required
                      placeholder="Your name"
                      className="bg-[#333] border-white/10 text-white mt-1 h-11"
                      value={bookingForm.customerName}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, customerName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Phone Number</Label>
                    <Input
                      required
                      type="tel"
                      placeholder="Your phone number"
                      className="bg-[#333] border-white/10 text-white mt-1 h-11"
                      value={bookingForm.customerPhone}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, customerPhone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Email Address</Label>
                  <Input
                    required
                    type="email"
                    placeholder="Your email"
                    className="bg-[#333] border-white/10 text-white mt-1 h-11"
                    value={bookingForm.customerEmail}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, customerEmail: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold h-12 rounded-full"
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
