import { Router, Request, Response } from "express";
import {
  loans,
  getNextLoanId,
  getActiveLoansByMember,
  isBookCurrentlyLoaned,
  calculateDueDate,
} from "../data/loans";
import { books } from "../data/books";
import { members } from "../data/members";
import { Loan, CreateLoanDto } from "../types/loan";

const router = Router();

const MAX_ACTIVE_LOANS = 5;

/**
 * GET /loans — pagination
 */
router.get("/", (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = loans.slice(start, end);

  res.status(200).json({
    data: paginated,
    pagination: {
      page,
      limit,
      total: loans.length,
      totalPages: Math.ceil(loans.length / limit),
    },
  });
});

/**
 * GET /loans/:id
 */
router.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const loan = loans.find((l) => l.id === id);

  if (!loan) {
    return res.status(404).json({ error: "Loan not found" });
  }

  res.status(200).json(loan);
});

/**
 * POST /loans — шинэ зээл үүсгэх
 *
 * Бизнес дүрмүүд:
 *   - Member байх ёстой (404 хэрвээ үгүй бол)
 *   - Ном байх ёстой (404 хэрвээ үгүй бол)
 *   - Member 5+ зээлтэй бол 422
 *   - Ном аль хэдийн зээлэгдсэн бол 409
 */
router.post("/", (req: Request, res: Response) => {
  const dto = req.body as CreateLoanDto;

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

  // Бизнес дүрэм 1: 5 ном лимит
  const activeLoans = getActiveLoansByMember(dto.memberId);
  if (activeLoans.length >= MAX_ACTIVE_LOANS) {
    return res.status(422).json({
      error: `Member has reached the maximum of ${MAX_ACTIVE_LOANS} active loans`,
    });
  }

  // Бизнес дүрэм 2: Ном идэвхтэй зээлэгдсэн эсэх
  if (isBookCurrentlyLoaned(dto.bookId)) {
    return res.status(409).json({
      error: "Book is currently loaned by another member",
    });
  }

  // Шинэ зээл үүсгэх
  const now = new Date();
  const newLoan: Loan = {
    id: getNextLoanId(),
    bookId: dto.bookId,
    memberId: dto.memberId,
    loanedAt: now.toISOString().split("T")[0],
    dueDate: calculateDueDate(now),
    returnedAt: null,
    extended: false,
  };

  loans.push(newLoan);

  // Номын available-ийг false болгох
  book.available = false;

  res.status(201).json(newLoan);
});

/**
 * PUT /loans/:id/extend — зээл сунгах
 *
 * Бизнес дүрэм:
 *   - Зээл байх ёстой (404)
 *   - Аль хэдийн буцаагдсан бол 409
 *   - Аль хэдийн нэг удаа сунгасан бол 409
 *   - Сунгахад dueDate += 14 хоног
 */
router.put("/:id/extend", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const loan = loans.find((l) => l.id === id);

  if (!loan) {
    return res.status(404).json({ error: "Loan not found" });
  }

  if (loan.returnedAt !== null) {
    return res.status(409).json({
      error: "Cannot extend a returned loan",
    });
  }

  if (loan.extended) {
    return res.status(409).json({
      error: "Loan has already been extended once",
    });
  }

  // 14 хоног нэмэх
  loan.dueDate = calculateDueDate(new Date(loan.dueDate));
  loan.extended = true;

  res.status(200).json(loan);
});

/**
 * PUT /loans/:id/return — ном буцаах
 */
router.put("/:id/return", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const loan = loans.find((l) => l.id === id);

  if (!loan) {
    return res.status(404).json({ error: "Loan not found" });
  }

  if (loan.returnedAt !== null) {
    return res.status(409).json({
      error: "Loan has already been returned",
    });
  }

  loan.returnedAt = new Date().toISOString().split("T")[0];

  // Номын available-ийг true болгох
  const book = books.find((b) => b.id === loan.bookId);
  if (book) {
    book.available = true;
  }

  res.status(200).json(loan);
});

export default router;