import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, password, clientId } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("watchPartySessions");

    const session = await collection.findOne({ sessionId });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      session.hashedPassword
    );
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }
    if (!session.clients.includes(clientId)) {
      await collection.updateOne(
        { sessionId },
        { $push: { clients: clientId } }
      );
    }
    return NextResponse.json(
      { message: "Joined session successfully",magenetURI: session.magnetURI },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}
