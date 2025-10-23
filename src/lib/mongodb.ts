/* eslint-disable prefer-const */
import { MongoClient, ServerApiVersion } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGO DB URI is not defined!");
}

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

attachDatabasePool(client);

// Connect once
let clientPromise = client.connect();

// Get database and collection references
const database = client.db("vitals");
const collection = database.collection("patient");

export { client, clientPromise, database, collection };
