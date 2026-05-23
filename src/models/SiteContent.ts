import mongoose, { Schema, Document } from "mongoose";

export interface ISiteContent extends Document {
  key: string;
  data: Record<string, unknown>;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>({
  key:  { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

export default mongoose.models.SiteContent || mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);
