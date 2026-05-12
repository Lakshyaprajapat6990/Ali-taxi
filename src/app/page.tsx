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
  CreditCard,
  Star,
  Menu,
  X,
  CheckCircle,
  ArrowRight,
  Calendar,
  Timer,
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

// Airport routes
const airportRoutes = [
  {
    name: "Stansted Airport",
    code: "STN",
    distance: 65,
    basePrice: 80,
    estimatedTime: "1h 15m",
    image: "/airports/stansted.jpg",
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
    name: "Heathrow Airport",
    code: "LHR",
    distance: 120,
    basePrice: 150,
    estimatedTime: "2h 15m",
    image: "/airports/heathrow.jpg",
  },
  {
    name: "Luton Airport",
    code: "LTN",
    distance: 95,
    basePrice: 110,
    estimatedTime: "1h 45m",
    image: "/airports/luton.jpg",
  },
  {
    name: "Manchester Airport",
    code: "MAN",
    distance: 180,
    basePrice: 220,
    estimatedTime: "3h 30m",
    image: "/airports/manchester.jpg",
  },
];

// Services offered
const services = [
  {
    icon: <Plane className="w-8 h-8" />,
    title: "Airport Transfers",
    description: "Reliable transfers to all major UK airports",
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Long Distance",
    description: "Comfortable travel to any UK destination",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "24/7 Service",
    description: "Available round the clock, every day",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Safe & Secure",
    description: "Licensed drivers, insured vehicles",
  },
];

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);

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
    setSelectedAirport(airportName);
    setBookingForm((prev) => ({
      ...prev,
      dropoffLocation: airportName,
    }));
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-yellow-500 tracking-wide">
                  ALITAXIS
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-400 -mt-1">NORWICH LTD</p>
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
                  className={`text-sm font-medium transition-colors hover:text-yellow-500 ${
                    activeSection === item.id ? "text-yellow-500" : "text-gray-300"
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
                className="flex items-center gap-2 text-yellow-500 font-semibold"
              >
                <Phone className="w-4 h-4" />
                <span>077 XXX XXXXXX</span>
              </a>
              <Button
                onClick={() => setIsBookingOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6"
              >
                Book Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-yellow-500 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 border-t border-yellow-500/20">
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
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <a
                  href="tel:077XXXXXXXX"
                  className="flex items-center gap-2 text-yellow-500 font-semibold py-2 px-4"
                >
                  <Phone className="w-4 h-4" />
                  <span>077 XXX XXXXXX</span>
                </a>
                <Button
                  onClick={() => {
                    setIsBookingOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold mt-2"
                >
                  Book Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-16 sm:pt-20 min-h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="text-center lg:text-left">
              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 mb-4 sm:mb-6">
                Norwich's Trusted Taxi Service
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                <span className="text-yellow-500">ALITAXIS</span>
                <br />
                <span className="text-white text-2xl sm:text-3xl md:text-4xl">NORWICH LTD</span>
              </h1>
              <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                Your reliable partner for long-distance taxi services and airport transfers.
                Travel in comfort from Norwich to anywhere in the UK.
              </p>

              {/* Features */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 bg-yellow-500/10 px-3 sm:px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs sm:text-sm text-yellow-500">24/7 Available</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-500/10 px-3 sm:px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs sm:text-sm text-yellow-500">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-500/10 px-3 sm:px-4 py-2 rounded-full">
                  <CreditCard className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs sm:text-sm text-yellow-500">Fixed Prices</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
                >
                  Book Your Ride
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <a href="tel:077XXXXXXXX">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 font-bold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
                  >
                    <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Call Now
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Column - Quick Booking Card */}
            <div className="hidden lg:block">
              <Card className="bg-gray-900/80 border-yellow-500/20 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-500 mb-6">
                    Quick Quote
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Pickup Location</Label>
                      <Input
                        placeholder="Enter pickup address"
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                        value={bookingForm.pickupLocation}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, pickupLocation: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Dropoff Location</Label>
                      <Input
                        placeholder="Enter destination"
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                        value={bookingForm.dropoffLocation}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Date</Label>
                        <Input
                          type="date"
                          className="bg-gray-800 border-gray-700 text-white mt-1"
                          value={bookingForm.pickupDate}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, pickupDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Time</Label>
                        <Input
                          type="time"
                          className="bg-gray-800 border-gray-700 text-white mt-1"
                          value={bookingForm.pickupTime}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, pickupTime: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsBookingOpen(true)}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 sm:py-6"
                    >
                      Get Quote & Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-yellow-500/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Book Taxi Section */}
      <section id="book" className="py-16 sm:py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              <span className="text-yellow-500">Book</span> Your Taxi
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Fill in your journey details and we'll provide you with an instant quote.
              Long-distance travel made easy.
            </p>
          </div>

          {/* Vehicle Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {vehicleTypes.map((vehicle) => (
              <Card
                key={vehicle.id}
                className={`bg-gray-800 border-2 cursor-pointer transition-all hover:scale-105 ${
                  bookingForm.vehicleType === vehicle.id
                    ? "border-yellow-500 shadow-lg shadow-yellow-500/20"
                    : "border-gray-700"
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
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                      <span>{vehicle.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Luggage className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                      <span>{vehicle.luggage}</span>
                    </div>
                  </div>
                  <p className="text-yellow-500 font-bold mt-3 sm:mt-4">
                    £{vehicle.pricePerMile.toFixed(2)}/mile
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Booking Form */}
          <div className="lg:hidden">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Pickup Location</Label>
                    <Input
                      placeholder="Enter pickup address"
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                      value={bookingForm.pickupLocation}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, pickupLocation: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Dropoff Location</Label>
                    <Input
                      placeholder="Enter destination"
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                      value={bookingForm.dropoffLocation}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-300">Date</Label>
                      <Input
                        type="date"
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                        value={bookingForm.pickupDate}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, pickupDate: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Time</Label>
                      <Input
                        type="time"
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                        value={bookingForm.pickupTime}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, pickupTime: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 sm:py-6"
                  >
                    Complete Booking
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Info Cards */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <Calendar className="w-10 h-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Easy Booking</h3>
                <p className="text-gray-400">
                  Book online or call us. We'll confirm your ride within minutes.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <Shield className="w-10 h-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Safe & Reliable</h3>
                <p className="text-gray-400">
                  All drivers are DBS checked and vehicles are regularly maintained.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <CreditCard className="w-10 h-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Fixed Pricing</h3>
                <p className="text-gray-400">
                  No hidden charges. The price you see is the price you pay.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Airport Transfers Section */}
      <section id="airports" className="py-16 sm:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 mb-4">
              Airport Transfers
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              <span className="text-yellow-500">Airport</span> Transfer Services
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Reliable airport transfers from Norwich to all major UK airports.
              We monitor flight times and adjust pickup accordingly.
            </p>
          </div>

          {/* Airport Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {airportRoutes.map((airport) => (
              <Card
                key={airport.code}
                className="bg-gray-900 border-gray-800 hover:border-yellow-500/50 transition-all overflow-hidden group"
              >
                <div className="h-32 sm:h-40 relative overflow-hidden">
                  <img 
                    src={airport.image} 
                    alt={airport.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-black font-bold">{airport.code}</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Plane className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-500" />
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{airport.name}</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                      <span>{airport.distance} miles</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                      <span>{airport.estimatedTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs">From</p>
                      <p className="text-xl sm:text-2xl font-bold text-yellow-500">
                        £{airport.basePrice}
                      </p>
                    </div>
                    <Button
                      onClick={() => openAirportBooking(airport.name)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
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
            <Card className="inline-block bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
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

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Why <span className="text-yellow-500">Choose</span> Us
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              We're committed to providing the best taxi service in Norwich.
              Here's what makes us different.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 hover:border-yellow-500/50 transition-all group"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/20 transition-colors">
                    <div className="text-yellow-500">{service.icon}</div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mt-12 sm:mt-16">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
              What Our <span className="text-yellow-500">Customers</span> Say
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  name: "Sarah M.",
                  text: "Excellent service! Driver was on time and very professional. Will definitely use again.",
                  rating: 5,
                },
                {
                  name: "John D.",
                  text: "Best airport transfer service in Norwich. Fixed prices and clean vehicles.",
                  rating: 5,
                },
                {
                  name: "Emily R.",
                  text: "Used Alitaxis for my trip to Heathrow. Smooth journey and great value for money.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex gap-1 mb-3 sm:mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                      "{testimonial.text}"
                    </p>
                    <p className="text-yellow-500 font-semibold text-sm sm:text-base">
                      - {testimonial.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
                <span className="text-yellow-500">Contact</span> Us
              </h2>
              <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
                Have questions or need a quote? Get in touch with us. We're available 24/7.
              </p>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Phone</p>
                    <a href="tel:077XXXXXXXX" className="text-white hover:text-yellow-500 font-semibold text-sm sm:text-base">
                      077 XXX XXXXXX
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Email</p>
                    <a href="mailto:Alixxxxxxxxxxxx@gmail.com" className="text-white hover:text-yellow-500 font-semibold text-sm sm:text-base">
                      Alixxxxxxxxxxxx@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Location</p>
                    <p className="text-white font-semibold text-sm sm:text-base">Norwich, UK</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Hours</p>
                    <p className="text-white font-semibold text-sm sm:text-base">24/7 Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                    Send us a Message
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Name</Label>
                      <Input placeholder="Your name" className="bg-gray-800 border-gray-700 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Email</Label>
                      <Input type="email" placeholder="Your email" className="bg-gray-800 border-gray-700 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Phone</Label>
                      <Input placeholder="Your phone number" className="bg-gray-800 border-gray-700 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Message</Label>
                      <Textarea
                        placeholder="How can we help you?"
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                        rows={4}
                      />
                    </div>
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 sm:py-6">
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
      <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Car className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-yellow-500">ALITAXIS</h3>
                  <p className="text-xs text-gray-400">NORWICH LTD</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Your trusted partner for long-distance taxi services and airport transfers
                from Norwich.
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
                      className="text-gray-400 hover:text-yellow-500 transition-colors text-xs sm:text-sm"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Airport Transfers */}
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Airport Transfers</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {airportRoutes.map((airport) => (
                  <li key={airport.code}>
                    <button
                      onClick={() => openAirportBooking(airport.name)}
                      className="text-gray-400 hover:text-yellow-500 transition-colors text-xs sm:text-sm"
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
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span>077 XXX XXXXXX</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span className="break-all">Alixxxxxxxxxxxx@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span>Norwich, UK</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} Alitaxis Norwich Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-yellow-500">
              Complete Your Booking
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in your details to confirm your taxi booking
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
                <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Journey Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Pickup Location</Label>
                    <Input
                      required
                      placeholder="e.g., Norwich City Centre"
                      className="bg-gray-800 border-gray-700 text-white mt-1 h-11"
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
                      placeholder="e.g., Stansted Airport"
                      className="bg-gray-800 border-gray-700 text-white mt-1 h-11"
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
                      className="bg-gray-800 border-gray-700 text-white mt-1 h-11"
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
                      className="bg-gray-800 border-gray-700 text-white mt-1 h-11"
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
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} {n === 1 ? "Passenger" : "Passengers"}
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
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} {n === 1 ? "Bag" : "Bags"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Vehicle Type</Label>
                    <Select
                      value={bookingForm.vehicleType}
                      onValueChange={(value) =>
                        setBookingForm({ ...bookingForm, vehicleType: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
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
                <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Your Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Full Name</Label>
                    <Input
                      required
                      placeholder="Your name"
                      className="bg-gray-800 border-gray-700 text-white mt-1 h-11"
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
                      className="bg-gray-800 border-gray-700 text-white mt-1 h-11"
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
                    className="bg-gray-800 border-gray-700 text-white mt-1 h-11"
                    value={bookingForm.customerEmail}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, customerEmail: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Special Requests (Optional)</Label>
                  <Textarea
                    placeholder="Any special requirements?"
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    value={bookingForm.specialRequests}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, specialRequests: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Price Estimate */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Estimated Price</span>
                  <span className="text-2xl font-bold text-yellow-500">
                    £{(() => {
                      const vehicle = vehicleTypes.find((v) => v.id === bookingForm.vehicleType);
                      const airport = airportRoutes.find((a) =>
                        bookingForm.dropoffLocation.toLowerCase().includes(a.name.toLowerCase())
                      );
                      if (airport && vehicle) {
                        return Math.round(airport.basePrice * (vehicle.pricePerMile / 2));
                      }
                      return "Contact for Quote";
                    })()}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Final price will be confirmed after booking review
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-6"
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
