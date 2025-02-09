import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let client: MongoClient;

declare global {
  //eslint-disable-next-line
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!globalThis._mongoClientPromise) {
  client = new MongoClient(uri);
  globalThis._mongoClientPromise = client.connect();
}

const clientPromise: Promise<MongoClient> = globalThis._mongoClientPromise;

export default clientPromise;
