import express, { Application } from "express";
import cors from "cors";
import booksRouter from "./routes/books";
import membersRouter from "./routes/members";
import loansRouter from "./routes/loans";
import reservationsRouter from "./routes/reservations";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "library-api" });
});

app.use("/books", booksRouter);
app.use("/members", membersRouter);
app.use("/loans", loansRouter);
app.use("/reservations", reservationsRouter);

export default app;