import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  luggage: number;
  vehicleType: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  // Live location
  locationLat?: number;
  locationLng?: number;
  locationAddress?: string;
  // Linked user (optional)
  userId?: mongoose.Types.ObjectId;
  // Driver details (filled by admin on confirmation)
  driverName?: string;
  driverPhone?: string;
  taxiNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    pickupLocation:  { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    pickupDate:      { type: String, required: true },
    pickupTime:      { type: String, required: true },
    passengers:      { type: Number, required: true, min: 1 },
    luggage:         { type: Number, required: true, min: 0 },
    vehicleType:     { type: String, required: true, enum: ["economy", "standard", "executive", "mpv"] },
    customerName:    { type: String, required: true },
    customerEmail:   { type: String, required: true, lowercase: true },
    customerPhone:   { type: String, required: true },
    specialRequests: { type: String, default: null },
    price:           { type: Number, required: true, default: 0 },
    status:          { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    locationLat:     { type: Number, default: null },
    locationLng:     { type: Number, default: null },
    locationAddress: { type: String, default: null },
    userId:          { type: Schema.Types.ObjectId, ref: "User", default: null },
    driverName:      { type: String, default: null },
    driverPhone:     { type: String, default: null },
    taxiNumber:      { type: String, default: null },
  },
  { timestamps: true }
);

// Indexes for common queries
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ customerEmail: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
