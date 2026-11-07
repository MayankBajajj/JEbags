import dns from "dns";
import mongoose from "mongoose";

// Some Windows/network setups refuse DNS SRV queries (used by mongodb+srv://
// connection strings) on the system's default resolver. Google's public DNS
// handles them fine — this only affects this process's lookups.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set — add it to server/.env");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
