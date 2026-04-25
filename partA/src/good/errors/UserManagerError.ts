/**
 * UserManager сангийн бүх домэйн алдааны суурь класс.
 *
 * Энэ класс нь Алдаа №5, №8-ийн засвар:
 *   - Алдааг string-ээр буцахын оронд тусгай exception class ашиглах
 *   - Дотоод SQLException-ийг гадагш гаргахгүй, домэйн алдаа болгож хувиргах
 *
 * Бүх дэд алдаанууд `code` талбартай — машинаар таних, REST API хариунд
 * шууд ашиглахад тохиромжтой.
 */
export abstract class UserManagerError extends Error {
  /**
   * Алдааг машинаар таних код (жишээ: "USER_NOT_FOUND").
   */
  public abstract readonly code: string;

  constructor(message: string) {
    super(message);
    // Error class-ийн prototype-г зөв тохируулах (TypeScript-ийн нийтлэг хэв маяг)
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
  }
}