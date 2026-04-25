import { UserManagerError } from "./UserManagerError";

/**
 * Database эсвэл бусад storage давхрагатай харьцахад гарсан алдаа.
 *
 * Алдаа №8-ийн засвар: SQLException гэх мэт infrastructure-ийн алдааг
 * гадагш гаргахгүй, харин үүний оронд RepositoryError болгож барина.
 *
 * Анхдагч алдааг `cause` талбараар хадгалах боломжтой — debug-д тустай.
 *
 * @example
 *   try {
 *     await db.query(...);
 *   } catch (sqlErr) {
 *     throw new RepositoryError("Failed to save user", sqlErr);
 *   }
 */
export class RepositoryError extends UserManagerError {
  public readonly code = "REPOSITORY_ERROR";

  /**
   * @param message  Алдааны товч тайлбар
   * @param cause    Анхдагч алдаа (database driver-аас ирсэн эх алдаа)
   */
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
  }
}