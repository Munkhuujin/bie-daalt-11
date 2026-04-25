import { UserManagerError } from "./UserManagerError";

/**
 * Аль хэдийн бүртгэлтэй email-р шинэ хэрэглэгч үүсгэх оролдлого хийсэн үед шиднэ.
 *
 * @example
 *   throw new DuplicateEmailError("user@example.com");
 */
export class DuplicateEmailError extends UserManagerError {
  public readonly code = "DUPLICATE_EMAIL";

  /**
   * @param email Давхардсан email хаяг
   */
  constructor(email: string) {
    super(`Email already exists: ${email}`);
  }
}