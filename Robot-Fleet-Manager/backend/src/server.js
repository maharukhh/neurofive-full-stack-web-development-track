import express from "express";
import cors from "cors";
import robotsRouter from "./routes/robots.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/robots", robotsRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralized error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Robot Fleet Manager API running on http://localhost:${PORT}`);
});
