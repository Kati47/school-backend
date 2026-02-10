import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export async function connectDb() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGO_URI);
  logger.info("Connected to MongoDB");
}
