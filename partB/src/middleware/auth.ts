import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendProblem } from "./errorHandler";

const JWT_SECRET = "library-api-secret-2026";

export interface AuthPayload {
  userId: number;
  email: string;
  role: "admin" | "user";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * JWT verify middleware.
 * Header дотор "Authorization: Bearer <token>" байх ёстой.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendProblem(
      res,
      401,
      "Unauthorized",
      "Missing or invalid Authorization header",
      req.originalUrl
    );
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch (err) {
    return sendProblem(
      res,
      401,
      "Unauthorized",
      "Invalid or expired token",
      req.originalUrl
    );
  }
}

/**
 * Admin эрх шалгах middleware.
 * Эхлээд requireAuth ажиллах ёстой.
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== "admin") {
    return sendProblem(
      res,
      403,
      "Forbidden",
      "Admin role required",
      req.originalUrl
    );
  }
  next();
}

/**
 * Token үүсгэх helper
 */
export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}