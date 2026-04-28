export interface Reservation {
  id: number;
  bookId: number;
  memberId: number;
  reservedAt: string;
  status: "active" | "fulfilled" | "cancelled";
}

export interface CreateReservationDto {
  bookId: number;
  memberId: number;
}