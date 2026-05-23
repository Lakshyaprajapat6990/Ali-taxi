import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: "Image upload not configured. Add CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET to environment variables." }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Only image files are allowed (JPG, PNG, WebP, GIF, SVG)" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large. Max size is 5MB." }, { status: 400 });

    // Upload to Cloudinary via unsigned upload preset
    const cloudForm = new FormData();
    cloudForm.append("file", file);
    cloudForm.append("upload_preset", uploadPreset);
    cloudForm.append("folder", "alitaxis");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudForm,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message ?? "Cloudinary upload failed" }, { status: 500 });
    }

    return NextResponse.json({ url: data.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
