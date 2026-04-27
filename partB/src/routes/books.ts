import { Router, Request, Response } from "express";
import { books, getNextBookId } from "../data/books";
import { Book, CreateBookDto, UpdateBookDto } from "../types/book";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  let result = [...books];

  const author = req.query.author as string;
  if (author) {
    result = result.filter((b) =>
      b.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  const sort = req.query.sort as string;
  const order = (req.query.order as string) === "desc" ? -1 : 1;
  if (sort === "title" || sort === "author" || sort === "publishedYear") {
    result.sort((a, b) => {
      if (a[sort] < b[sort]) return -1 * order;
      if (a[sort] > b[sort]) return 1 * order;
      return 0;
    });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = result.slice(start, end);

  res.status(200).json({
    data: paginated,
    pagination: {
      page,
      limit,
      total: result.length,
      totalPages: Math.ceil(result.length / limit),
    },
  });
});

router.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id)); 
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json(book);
});

router.post("/", (req: Request, res: Response) => {
  const dto = req.body as CreateBookDto;

  if (!dto.title || !dto.author || !dto.isbn || !dto.publishedYear) {
    return res.status(400).json({
      error: "Missing required fields: title, author, isbn, publishedYear",
    });
  }

  const newBook: Book = {
    id: getNextBookId(),
    title: dto.title,
    author: dto.author,
    isbn: dto.isbn,
    publishedYear: dto.publishedYear,
    available: true,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

router.put("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id)); 
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const dto = req.body as UpdateBookDto;
  if (dto.title !== undefined) book.title = dto.title;
  if (dto.author !== undefined) book.author = dto.author;
  if (dto.isbn !== undefined) book.isbn = dto.isbn;
  if (dto.publishedYear !== undefined) book.publishedYear = dto.publishedYear;
  if (dto.available !== undefined) book.available = dto.available;

  res.status(200).json(book);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));  
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(index, 1);
  res.status(204).send();
});

export default router;