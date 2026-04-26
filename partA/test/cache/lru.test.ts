import { CacheFactory } from "../../lib";
import { InvalidConfigError } from "../../lib";
import type { Cache } from "../../lib";

/**
 * LRU cache-ийн unit тестүүд.
 *
 * Тестүүдийг 3 хэсэгт хуваасан:
 *   1. Үндсэн үйлдлүүд (set, get, has, delete, clear, size)
 *   2. LRU логик (хамгийн чухал хэсэг — eviction policy шалгана)
 *   3. Алдааны шалгалтууд (config validation)
 *
 * capacity = 3 байхаар тохируулсан. Олон key хийгээд хамгийн хуучин нь
 * устгагдаж байгааг шалгах гэж бодсон.
 */
describe("LRU Cache", () => {
  let cache: Cache<number>;

  beforeEach(() => {
    cache = CacheFactory.create<number>("lru", { capacity: 3 });
  });

  // ─── Үндсэн үйлдлүүд ────────────────────────────────────

  test("set and get work with single key", () => {
    cache.set("A", 1);
    expect(cache.get("A")).toBe(1);
  });

  test("returns null for missing key", () => {
    // Exception биш null буцаах ёстой
    expect(cache.get("missing")).toBeNull();
  });

  test("size starts at 0 and grows with set", () => {
    expect(cache.size()).toBe(0);
    cache.set("A", 1);
    expect(cache.size()).toBe(1);
    cache.set("B", 2);
    expect(cache.size()).toBe(2);
  });

  test("has() returns true only for existing keys", () => {
    cache.set("A", 1);
    expect(cache.has("A")).toBe(true);
    expect(cache.has("B")).toBe(false);
  });

  test("delete() removes the key and returns true", () => {
    cache.set("A", 1);
    expect(cache.delete("A")).toBe(true);
    expect(cache.has("A")).toBe(false);
    expect(cache.delete("A")).toBe(false); // аль хэдийн устсан
  });

  test("clear() removes all keys", () => {
    cache.set("A", 1);
    cache.set("B", 2);
    cache.clear();
    expect(cache.size()).toBe(0);
    expect(cache.has("A")).toBe(false);
  });

  // ─── LRU логик ─────────────────────────────────────────

  /**
   * Энэ тест нь LRU-н хамгийн гол шалгуур.
   * capacity дүүрсний дараа дараагийн set нь хамгийн хуучныг устгах ёстой.
   */
  test("evicts least recently used key when capacity is exceeded", () => {
    cache.set("A", 1);
    cache.set("B", 2);
    cache.set("C", 3);
    cache.set("D", 4); // A устах ёстой (хамгийн эртний)

    expect(cache.has("A")).toBe(false);
    expect(cache.has("B")).toBe(true);
    expect(cache.has("C")).toBe(true);
    expect(cache.has("D")).toBe(true);
    expect(cache.size()).toBe(3);
  });

  // get хийсэн key "сэргэж" хамгийн сүүлд ашиглагдсан болно
  // Энэ нь Map.delete + Map.set ашиглаж дарааллыг шинэчилснийг шалгана
  test("get() refreshes a key making it most recently used", () => {
    cache.set("A", 1);
    cache.set("B", 2);
    cache.set("C", 3);

    cache.get("A"); // дараалал одоо: B, C, A
    cache.set("D", 4); // B устах ёстой

    expect(cache.has("A")).toBe(true);
    expect(cache.has("B")).toBe(false);
  });

  test("set() on existing key updates value and refreshes recency", () => {
    cache.set("A", 1);
    cache.set("B", 2);
    cache.set("C", 3);

    cache.set("A", 100); // утга шинэчилнэ + recency refresh хийнэ
    cache.set("D", 4);

    expect(cache.get("A")).toBe(100);
    expect(cache.has("B")).toBe(false); // B нь хамгийн эртний болсон тул устна
  });

  test("does not exceed capacity ever", () => {
    // 10 key set хийгээд size 3-аас хэтрэхгүй гэдгийг шалгах
    for (let i = 0; i < 10; i++) {
      cache.set(`key${i}`, i);
    }
    expect(cache.size()).toBe(3);
  });

  // ─── Алдааны тестүүд ────────────────────────────────────

  test("throws InvalidConfigError for capacity <= 0", () => {
    expect(() => {
      CacheFactory.create("lru", { capacity: 0 });
    }).toThrow(InvalidConfigError);

    expect(() => {
      CacheFactory.create("lru", { capacity: -5 });
    }).toThrow(InvalidConfigError);
  });
});