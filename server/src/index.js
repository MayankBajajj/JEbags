import "dotenv/config";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { seedAdmin } from "./utils/seedAdmin.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import enquiryRoutes from "./routes/enquiry.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// server/src -> server/public (built frontend lives inside server/ so it
// deploys together with the backend on hosts that isolate the app root)
const distDir = path.join(__dirname, "../public");
const hasFrontendBuild = fs.existsSync(path.join(distDir, "index.html"));

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/enquiries", enquiryRoutes);

app.use("/api", notFound);

// Serve the built frontend (npm run build at the project root) so a single
// Node.js process can host both the API and the site — convenient for
// shared-hosting setups that only run one app per slot.
if (hasFrontendBuild) {
  app.use(express.static(distDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  app.use(notFound);
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(seedAdmin)
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
