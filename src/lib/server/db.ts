import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectDB() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not set");

  if (!global._mongooseConn) {
    global._mongooseConn = mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }

  return global._mongooseConn;
}
