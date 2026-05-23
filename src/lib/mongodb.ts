import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) throw new Error("MONGO_URI is not defined in .env");

/* Cache connection across hot-reloads in dev */
declare global {
  // eslint-disable-next-line no-var
  var _mongoConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cached = global._mongoConn ?? { conn: null, promise: null };
global._mongoConn = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      dbName: "alitaxis",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
