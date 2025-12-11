import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Media from "@/lib/models/Media";

interface MediaRouteContext {
  params: Promise<{
    eventId: string;
  }>;
}

export async function GET(_req: NextRequest, context: MediaRouteContext) {
  try {
    await connectDB();

    // Required for Next.js 16: params is now a Promise
    const { eventId } = await context.params;

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing eventId" },
        { status: 400 }
      );
    }

    const media = await Media.find({ eventId }).sort({ createdAt: -1 });

    return NextResponse.json({ media });
  } catch (error) {
    console.error("Fetch Media Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}
