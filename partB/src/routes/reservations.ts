import { Router, Request, Response } from "express";
import {
  reservations,
  getNextReservationId,
} from "../data/reservations";
import { books } from "../data/books";
import { members } from "../data/members";
import { Reservation, CreateReservationDto } from "../types/reservation";

const router = Router();

/**
 * GET /reservations — pagination
 */
router.get("/", (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = reservations.slice(start, end);

  res.status(200).json({
    data: paginated,
    pagination: {
      page,
      limit,
      total: reservations.length,
      totalPages: Math.ceil(reservations.length / limit),
    },
  });
});

/**
 * GET /reservations/:id
 */
router.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const reservation = reservations.find((r) => r.id === id);

  if (!reservation) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  res.status(200).json(reservation);
});

/**
 * POST /reservations — шинэ захиалга
 */
router.post("/", (req: Request, res: Response) => {
  const dto = req.body as CreateReservationDto;

  if (!dto.bookId || !dto.memberId) {
    return res.status(400).json({
      error: "Missing required fields: bookId, memberId",
    });
  }

  // Member шалгах
  const member = members.find((m) => m.id === dto.memberId);
  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  // Book шалгах
  const book = books.find((b) => b.id === dto.bookId);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  // Давхардсан active reservation шалгах
  const existing = reservations.find(
    (r) =>
      r.bookId === dto.bookId &&
      r.memberId === dto.memberId &&
      r.status === "active"
  );

  if (existing) {
    return res.status(409).json({
      error: "Active reservation already exists for this book and member",
    });
  }

  const newReservation: Reservation = {
    id: getNextReservationId(),
    bookId: dto.bookId,
    memberId: dto.memberId,
    reservedAt: new Date().toISOString().split("T")[0],
    status: "active",
  };

  reservations.push(newReservation);
  res.status(201).json(newReservation);
});

/**
 * DELETE /reservations/:id — захиалгыг цуцлах
 */
router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const reservation = reservations.find((r) => r.id === id);

  if (!reservation) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  reservation.status = "cancelled";
  res.status(204).send();
});

export default router;