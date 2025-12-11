import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { CloudinaryUploadResult } from "types/cloudinary";
import Media from "@/lib/models/Media";

export async function POST(req: Request) {
  try {
    await connectDB();

    const form = await req.formData();
    const file = form.get("file") as File;
    const eventId = form.get("eventId") as string;

    if (!file || !eventId) {
      return NextResponse.json(
        { error: "Missing file or eventId" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `vilo/${eventId}`,
            resource_type: "auto",
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const result = upload as CloudinaryUploadResult;

    const newMedia = await Media.create({
      eventId,
      url: result.secure_url,
      publicId: result.public_id,
      type: result.resource_type === "video" ? "video" : "photo",
      width: result.width,
      height: result.height,
      duration: result.duration,
    });

    return NextResponse.json({ success: true, media: newMedia });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
