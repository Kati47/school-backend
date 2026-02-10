import { createServer } from "http";
import app from "./app";
import { connectDb } from "./config/db";
import { logger } from "./config/logger";
import { env } from "./config/env";
import { initSocket } from "./realtime/socket";

async function start() {
  await connectDb();
  const server = createServer(app);
  initSocket(server);

  server.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
}

start().catch((error) => {
  logger.error("Failed to start server", { error });
  process.exit(1);
});
