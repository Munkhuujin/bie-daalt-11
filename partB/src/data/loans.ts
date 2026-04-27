import { Loan } from "../types/loan";

// In-memory store
export const loans: Loan[] = [];

let nextId = 1;

export function getNextLoanId(): number {
  return nextId++;
}

/**
 * Тухайн member-н идэвхтэй (буцаагаагүй) зээлүүдийг олно
 */
export function getActiveLoansByMember(memberId: number): Loan[] {
  return loans.filter(
    (l) => l.memberId === memberId && l.returnedAt === null
  );
}

/**
 * Ном идэвхтэй зээлэгдсэн эсэхийг шалгана
 */
export function isBookCurrentlyLoaned(bookId: number): boolean {
  return loans.some(
    (l) => l.bookId === bookId && l.returnedAt === null
  );
}

/**
 * 14 хоногийн дараах огноог тооцох
 */
export function calculateDueDate(loanedAt: Date): string {
  const due = new Date(loanedAt);
  due.setDate(due.getDate() + 14);
  return due.toISOString().split("T")[0];
}