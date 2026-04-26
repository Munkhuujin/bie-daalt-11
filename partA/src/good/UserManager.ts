import {
  User,
  UserStatus,
  CreateUserDto,
  UpdateUserDto,
  UserSearchCriteria,
  UserManagerConfig,
} from "./types";
import {
  UserNotFoundError,
  DuplicateEmailError,
  InvalidInputError,
} from "./errors";

/**
 * Хэрэглэгчийн менежмент service.
 *
 * Муу API (`usr_mgr`)-ийн бүх алдааг засварласан хувилбар:
 *   - Алдаа №1: PascalCase нэр (UserManager)
 *   - Алдаа №2: Дотоод төлөв private болсон
 *   - Алдаа №3: Тодорхой type ашигласан (any байхгүй)
 *   - Алдаа №4: do_user_op-ийг 4 тусдаа метод болгосон
 *   - Алдаа №5: ERR_404 string биш, exception ашигласан
 *   - Алдаа №6: User объект буцаана, JSON string биш
 *   - Алдаа №7: getUserById, getUserByEmail тусдаа
 *   - Алдаа №8: SQLException биш, домэйн алдаанууд
 *   - Алдаа №9: UserSearchCriteria объект ашиглана
 *   - Алдаа №10: timeoutMs-ийг constructor-т шилжүүлсэн
 */
export class UserManager {
  private readonly users = new Map<string, User>();
  private readonly config: UserManagerConfig;

  constructor(config: UserManagerConfig) {
    if (config.timeoutMs <= 0) {
      throw new InvalidInputError(
        "timeoutMs",
        "Must be greater than 0"
      );
    }
    this.config = config;
  }

  /**
   * Шинэ хэрэглэгч үүсгэх.
   *
   * @param data Шинэ хэрэглэгчийн email, name
   * @returns Үүсгэсэн User объект
   * @throws {InvalidInputError} email эсвэл name хоосон үед
   * @throws {DuplicateEmailError} email аль хэдийн бүртгэлтэй үед
   */
  createUser(data: CreateUserDto): User {
    this.validateEmail(data.email);
    this.validateName(data.name);

    if (this.findByEmail(data.email)) {
      throw new DuplicateEmailError(data.email);
    }

    const now = new Date();
    const user: User = {
      id: this.generateId(),
      email: data.email,
      name: data.name,
      status: UserStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, user);
    return user;
  }

  /**
   * Хэрэглэгчийн мэдээллийг шинэчлэх.
   *
   * @param id Хэрэглэгчийн ID
   * @param data Өөрчлөх талбарууд (зөвхөн өгсөн талбарууд)
   * @returns Шинэчилсэн User объект
   * @throws {UserNotFoundError} хэрэглэгч олдоогүй үед
   * @throws {DuplicateEmailError} шинэ email өөр хэрэглэгчид байх үед
   */
  updateUser(id: string, data: UpdateUserDto): User {
    const existing = this.users.get(id);
    if (!existing) {
      throw new UserNotFoundError(id);
    }

    if (data.email && data.email !== existing.email) {
      this.validateEmail(data.email);
      if (this.findByEmail(data.email)) {
        throw new DuplicateEmailError(data.email);
      }
    }

    if (data.name !== undefined) {
      this.validateName(data.name);
    }

    const updated: User = {
      ...existing,
      email: data.email ?? existing.email,
      name: data.name ?? existing.name,
      updatedAt: new Date(),
    };

    this.users.set(id, updated);
    return updated;
  }

  /**
   * Хэрэглэгчийг soft delete хийх (status = DELETED).
   *
   * @param id Хэрэглэгчийн ID
   * @throws {UserNotFoundError} хэрэглэгч олдоогүй үед
   */
  deleteUser(id: string): void {
    const user = this.users.get(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    this.users.set(id, {
      ...user,
      status: UserStatus.DELETED,
      updatedAt: new Date(),
    });
  }

  /**
   * Устгасан хэрэглэгчийг сэргээх.
   *
   * @param id Хэрэглэгчийн ID
   * @returns Сэргээсэн User объект
   * @throws {UserNotFoundError} хэрэглэгч олдоогүй үед
   */
  restoreUser(id: string): User {
    const user = this.users.get(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    const restored: User = {
      ...user,
      status: UserStatus.ACTIVE,
      updatedAt: new Date(),
    };

    this.users.set(id, restored);
    return restored;
  }

  /**
   * ID-аар хэрэглэгч хайх.
   *
   * @param id Хэрэглэгчийн ID
   * @returns Олдвол User, эс бөгөөс null
   */
  getUserById(id: string): User | null {
    return this.users.get(id) ?? null;
  }

  /**
   * Email-ээр хэрэглэгч хайх.
   *
   * @param email Email хаяг
   * @returns Олдвол User, эс бөгөөс null
   */
  getUserByEmail(email: string): User | null {
    return this.findByEmail(email) ?? null;
  }

  /**
   * Шалгуурын дагуу хэрэглэгч хайх.
   *
   * @param criteria Хайлтын шалгуур (бүх талбар optional)
   * @returns Тохирох User-уудын массив
   */
  searchUsers(criteria: UserSearchCriteria): User[] {
    const all = Array.from(this.users.values());

    return all.filter((user) => {
      if (criteria.name && !user.name.includes(criteria.name)) return false;
      if (criteria.email && !user.email.includes(criteria.email)) return false;
      if (criteria.status && user.status !== criteria.status) return false;
      if (criteria.createdAfter && user.createdAt < criteria.createdAfter)
        return false;
      if (criteria.createdBefore && user.createdAt > criteria.createdBefore)
        return false;
      return true;
    });
  }

  // ─── Private helpers ─────────────────────────────────────

  private findByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new InvalidInputError("email", "Email cannot be empty");
    }
    if (!email.includes("@")) {
      throw new InvalidInputError("email", "Email format is invalid");
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new InvalidInputError(
        "name",
        "Name must be at least 2 characters"
      );
    }
  }

  private generateId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}