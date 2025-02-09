import clientPromise from "@/lib/mongodb";
import {NextResponse } from "next/server";

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db(); // Using the default database from URI
    const collection = db.collection("testing");

    const result = await collection.insertOne({ message: "Helllo" });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
    //eslint-disable-next-line
  } catch (error:any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
