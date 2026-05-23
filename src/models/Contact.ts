import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "read" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, lowercase: true, trim: true },
    phone:   { type: String, required: true },
    message: { type: String, required: true },
    status:  { type: String, enum: ["new", "read", "resolved"], default: "new" },
  },
  { timestamps: true }
);

ContactSchema.index({ status: 1, createdAt: -1 });

const Contact: Model<IContact> =
  mongoose.models.Contact ?? mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
