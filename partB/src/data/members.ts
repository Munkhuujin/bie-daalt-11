import { Member } from "../types/member";

// In-memory store
export const members: Member[] = [
  {
    id: 1,
    name: "Munkhuujin",
    email: "munkh@example.com",
    phone: "99001122",
    joinedAt: "2026-01-15",
  },
  {
    id: 2,
    name: "Bilguun",
    email: "bilguun@example.com",
    phone: "99332244",
    joinedAt: "2026-02-20",
  },
  {
    id: 3,
    name: "Dulguun",
    email: "dulguun@example.com",
    phone: "99554466",
    joinedAt: "2026-03-10",
  },
];

let nextId = members.length + 1;

export function getNextMemberId(): number {
  return nextId++;
}