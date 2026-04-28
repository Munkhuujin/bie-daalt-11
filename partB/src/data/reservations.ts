import { Reservation } from "../types/reservation";

export const reservations: Reservation[] = [];

let nextId = 1;

export function getNextReservationId(): number {
  return nextId++;
}

export function getActiveReservationsByBook(bookId: number): Reservation[] {
  return reservations.filter(
    (r) => r.bookId === bookId && r.status === "active"
  );
}