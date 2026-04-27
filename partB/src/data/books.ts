import { Book } from "../types/book";

// In-memory store — production-д DB ашиглана
export const books: Book[] = [
  {
    id: 1,
    title: "The Pragmatic Programmer",
    author: "Andy Hunt",
    isbn: "978-0135957059",
    publishedYear: 1999,
    available: true,
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    publishedYear: 2008,
    available: true,
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Erich Gamma",
    isbn: "978-0201633610",
    publishedYear: 1994,
    available: true,
  },
  {
    id: 4,
    title: "Refactoring",
    author: "Martin Fowler",
    isbn: "978-0134757599",
    publishedYear: 1999,
    available: false,
  },
  {
    id: 5,
    title: "Domain-Driven Design",
    author: "Eric Evans",
    isbn: "978-0321125217",
    publishedYear: 2003,
    available: true,
  },
];

// Auto-increment counter
let nextId = books.length + 1;

export function getNextBookId(): number {
  return nextId++;
}