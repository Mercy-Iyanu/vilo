import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    await connectDB();
    const count = await Event.countDocuments();
    const autoName = `Event #${count + 1}`;
    const newEvent = await Event.create({ name: autoName });
    const eventUrl = `${process.env.BASE_URL}/e/${newEvent._id}`;
    const qrCodeDataURL = await QRCode.toDataURL(eventUrl);

    return NextResponse.json({
      success: true,
      event: newEvent,
      eventUrl,
      qrCodeDataURL,
      eventId: newEvent._id,
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
