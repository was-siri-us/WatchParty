import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Fetch session data based on sessionId
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const sessionId = url.searchParams.get("sessionId");

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("watchPartySessions");

        // Fetch the session from the database
        const session = await collection.findOne({ sessionId });

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // Return the session with magnetURI
        return NextResponse.json(
            { magnetURI: session.magnetURI }, 
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
    }
}
