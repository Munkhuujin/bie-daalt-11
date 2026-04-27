import { Router, Request, Response } from "express";
import { members, getNextMemberId } from "../data/members";
import { Member, CreateMemberDto, UpdateMemberDto } from "../types/member";

const router = Router();

/**
 * GET /members
 * Pagination дэмжинэ.
 */
router.get("/", (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = members.slice(start, end);

  res.status(200).json({
    data: paginated,
    pagination: {
      page,
      limit,
      total: members.length,
      totalPages: Math.ceil(members.length / limit),
    },
  });
});

/**
 * GET /members/:id
 */
router.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const member = members.find((m) => m.id === id);

  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  res.status(200).json(member);
});

/**
 * POST /members
 */
router.post("/", (req: Request, res: Response) => {
  const dto = req.body as CreateMemberDto;

  if (!dto.name || !dto.email || !dto.phone) {
    return res.status(400).json({
      error: "Missing required fields: name, email, phone",
    });
  }

  // Email давхардал шалгалт
  const existing = members.find((m) => m.email === dto.email);
  if (existing) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const newMember: Member = {
    id: getNextMemberId(),
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    joinedAt: new Date().toISOString().split("T")[0],
  };

  members.push(newMember);
  res.status(201).json(newMember);
});

/**
 * PUT /members/:id
 */
router.put("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const member = members.find((m) => m.id === id);

  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  const dto = req.body as UpdateMemberDto;
  if (dto.name !== undefined) member.name = dto.name;
  if (dto.email !== undefined) member.email = dto.email;
  if (dto.phone !== undefined) member.phone = dto.phone;

  res.status(200).json(member);
});

/**
 * DELETE /members/:id
 */
router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const index = members.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Member not found" });
  }

  members.splice(index, 1);
  res.status(204).send();
});

export default router;