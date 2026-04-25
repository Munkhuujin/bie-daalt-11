import { UserManagerError } from "./UserManagerError";

/**
 * Хэрэглэгчийн оруулсан өгөгдөл буруу үед шиднэ.
 * (Жишээ: хоосон email, буруу форматтай email, хэт богино нэр г.м.)
 *
 * @example
 *   throw new InvalidInputError("email", "Email format is invalid");
 */
export class InvalidInputError extends UserManagerError {
  public readonly code = "INVALID_INPUT";

  /**
   * @param field   Алдаатай талбарын нэр
   * @param reason  Яагаад алдаатай гэдгийн тайлбар
   */
  constructor(
    public readonly field: string,
    public readonly reason: string
  ) {
    super(`Invalid input for field "${field}": ${reason}`);
  }
}