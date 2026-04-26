import { UserManagerError } from "./UserManagerError";

/**
 * Хэрэглэгч олдохгүй үед шиднэ.
 *
 * Алдаа №5-ийн засвар: 'ERR_404' string-ийн оронд тусгай exception ашиглана.
 *
 * @example
 *   throw new UserNotFoundError("user-123");
 */
export class UserNotFoundError extends UserManagerError {
  public readonly code = "USER_NOT_FOUND";

  /**
   * @param identifier Хайсан ID эсвэл email
   */
  constructor(public readonly identifier: string) {
  super(`User not found: ${identifier}`);
}
}