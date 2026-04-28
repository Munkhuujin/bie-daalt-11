import { Router, Request, Response } from "express";
import { generateToken } from "../middleware/auth";
import { sendProblem } from "../middleware/errorHandler";

const router = Router();

// Жишээ хэрэглэгчид (production-д DB ашиглана)
const users = [
  {
    id: 1,
    email: "admin@library.com",
    password: "admin123",
    role: "admin" as const,
  },
  {
    id: 2,
    email: "user@library.com",
    password: "user123",
    role: "user" as const,
  },
];

/**
 * POST /auth/login
 */
router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendProblem(
      res,
      400,
      "Bad Request",
      "Email and password are required",
      req.originalUrl
    );
  }

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return sendProblem(
      res,
      401,
      "Unauthorized",
      "Invalid email or password",
      req.originalUrl
    );
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.status(200).json({
    accessToken: token,
    userId: user.id,
    role: user.role,
  });
});

export default router;