import { CacheFactory } from "../../lib";
import { InvalidConfigError } from "../../lib";
import type { Cache } from "../../lib";

/**
 * TTL cache-ийн unit тестүүд.
 *
 * TTL-н гол шалгуур нь хугацаа дууссаны дараа key null буцаах ёстой.
 * Тестүүдэд бодит цаг (setTimeout) ашиглах болохоор зарим тест жаахан
 * удаан ажиллана (~200ms).
 */
describe("TTL Cache", () => {
  // Богино TTL-тэй кэш — хурдан тестлэхийн тулд
  let cache: Cache<number>;

  beforeEach(() => {
    cache = CacheFactory.create<number>("ttl", {
      capacity: 5,
      defaultTtlMs: 100, // 100ms TTL
    });
  });

  // Helper — async тестүүдэд хүлээх
  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  // ─── Үндсэн үйлдлүүд ────────────────────────────────────

  test("set and get work within TTL", () => {
    cache.set("A", 1);
    expect(cache.get("A")).toBe(1);
  });

  test("returns null for missing key", () => {
    expect(cache.get("missing")).toBeNull();
  });

  test("has() returns true for key within TTL", () => {
    cache.set("A", 1);
    expect(cache.has("A")).toBe(true);
  });

  test("delete() removes the key", () => {
    cache.set("A", 1);
    expect(cache.delete("A")).toBe(true);
    expect(cache.get("A")).toBeNull();
  });

  test("clear() removes all keys", () => {
    cache.set("A", 1);
    cache.set("B", 2);
    cache.clear();
    expect(cache.size()).toBe(0);
  });

  // ─── TTL зан чанар (хамгийн чухал) ──────────────────────

  // Хугацаа дууссаны дараа get null буцаах ёстой
  test("get() returns null after TTL expires", async () => {
    cache.set("A", 1);
    await sleep(150); // 100ms TTL-аас илүү хүлээх
    expect(cache.get("A")).toBeNull();
  });

  test("has() returns false after TTL expires", async () => {
    cache.set("A", 1);
    await sleep(150);
    expect(cache.has("A")).toBe(false);
  });

  // Шинээр set хийсний дараа TTL шинэчлэгдэх ёстой
  test("set() refreshes TTL for existing key", async () => {
    cache.set("A", 1);
    await sleep(60); // хагас TTL-ийн хугацаа
    cache.set("A", 2); // дахин set → TTL refresh
    await sleep(60); // эхний TTL-ээс хойшхи цаг (нийт 120ms)
    // Хэрэв refresh болсон бол утга үлдэх ёстой
    expect(cache.get("A")).toBe(2);
  });

  // ─── Алдааны тестүүд ────────────────────────────────────

  test("throws InvalidConfigError for missing defaultTtlMs", () => {
    expect(() => {
      CacheFactory.create("ttl", { capacity: 5 });
    }).toThrow(InvalidConfigError);
  });

  test("throws InvalidConfigError for defaultTtlMs <= 0", () => {
    expect(() => {
      CacheFactory.create("ttl", { capacity: 5, defaultTtlMs: 0 });
    }).toThrow(InvalidConfigError);

    expect(() => {
      CacheFactory.create("ttl", { capacity: 5, defaultTtlMs: -100 });
    }).toThrow(InvalidConfigError);
  });
});