/* eslint-disable prefer-const */
import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.NEXT_PUBLIC_MONGO_DB) {
  throw new Error("MONGO DB URI is not defined!");
}

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_DB, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect once
let clientPromise = client.connect();

// Get database and collection references
const database = client.db("eureka");
const collection = database.collection("user");

export { client, clientPromise, database, collection };
