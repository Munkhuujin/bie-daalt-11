export interface Loan {
  id: number;
  bookId: number;
  memberId: number;
  loanedAt: string;     // ISO date
  dueDate: string;      // ISO date (loanedAt + 14 days)
  returnedAt: string | null;
  extended: boolean;    // true бол сунгах боломжгүй
}

export interface CreateLoanDto {
  bookId: number;
  memberId: number;
}