import { Request, Response, NextFunction } from "express";

/**
 * RFC 7807 Problem Details формат.
 *
 * Алдаа гарсан үед бүгд application/problem+json content type-тай хариу буцаана.
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
}

/**
 * Алдааны response илгээх helper.
 *
 * Жишээ:
 *   sendProblem(res, 404, "Not Found", "Book not found", "/books/9999");
 */
export function sendProblem(
  res: Response,
  status: number,
  title: string,
  detail?: string,
  instance?: string
): void {
  const problem: ProblemDetails = {
    type: `https://example.com/problems/${status}`,
    title,
    status,
    detail,
    instance,
  };

  res
    .status(status)
    .setHeader("Content-Type", "application/problem+json")
    .json(problem);
}

/**
 * Global error handler — middleware-ийн төгсгөлд тавина.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("Error:", err.message);

  sendProblem(
    res,
    500,
    "Internal Server Error",
    err.message,
    req.originalUrl
  );
}