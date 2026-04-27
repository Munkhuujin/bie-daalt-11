import express, { Application } from "express";
import cors from "cors";
import booksRouter from "./routes/books";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "library-api" });
});

// Routes
app.use("/books", booksRouter);

export default app;