import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    await connectDB();
    const {name} = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Event name is required" },
        { status: 400 }
      );
    }
    const newEvent = await Event.create({ name });
    const eventUrl = `${process.env.BASE_URL}/e/${newEvent._id}`;
    const qrCodeDataURL = await QRCode.toDataURL(eventUrl);

    return NextResponse.json({
      success: true,
      event: newEvent,
      eventUrl,
      qrCodeDataURL,
    });
  } catch (error) {
    console.error("Event Create Error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
