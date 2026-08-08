import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
// Import Routes
import taskRoutes from "./routes/taskRoutes.js";

config();
connectDB();

const app = express();

// Body parsing middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/", taskRoutes);

// Only start a listening server when running locally (not on Vercel)
if (process.env.VERCEL !== "1") {
  const server = app.listen(process.env.PORT || 5001, "0.0.0.0", () => {
    console.log(`Server running on PORT ${process.env.PORT}`);
  });

  // Handle unhandled promise rejections (e.g., database connection errors)
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
      await disconnectDB();
      process.exit(1);
    });
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  });
}

export default app;
