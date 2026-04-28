import express, { Application } from "express";
import cors from "cors";
import booksRouter from "./routes/books";
import membersRouter from "./routes/members";
import loansRouter from "./routes/loans";
import reservationsRouter from "./routes/reservations";
import authRouter from "./routes/auth";
import { requireAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Health check (auth-гүй)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "library-api" });
});

// Auth routes (auth-гүй)
app.use("/auth", authRouter);

// Protected routes (auth шаардлагатай)
app.use("/books", requireAuth, booksRouter);
app.use("/members", requireAuth, membersRouter);
app.use("/loans", requireAuth, loansRouter);
app.use("/reservations", requireAuth, reservationsRouter);

// Error handler (төгсгөлд)
app.use(errorHandler);

export default app;