import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// interface Session {
//   password: string;
//   clients: string[];
// }

export async function POST(req: NextRequest) {
  try {
    const { sessionId, password, magnetURI } = await req.json();

    if (!sessionId || !password|| !magnetURI) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("watchPartySessions");
    const saltRounds: number = Number(process.env.SALT_ROUNDS);

    const sessionAlreadyExists = await collection.findOne({ sessionId });
    if (sessionAlreadyExists) {
      return NextResponse.json(
        { error: "Session already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await collection.insertOne({
      sessionId,
      hashedPassword,
      magnetURI,
      clients: [],
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("watchPartySessions");

    const session = await collection.findOne({ sessionId: sessionId });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    await collection.deleteOne({ sessionId: sessionId });
    return NextResponse.json(
      { message: "Session deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
