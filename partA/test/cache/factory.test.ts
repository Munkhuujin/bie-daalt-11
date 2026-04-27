import { CacheFactory } from "../../lib";
import {
  InvalidConfigError,
  UnknownCacheTypeError,
} from "../../lib";

/**
 * CacheFactory-н тестүүд.
 *
 * Factory нь үүсгэх алхамд config validation хийдэг. Тестүүд нь
 * 3 cache type зөв үүсэж байгаа эсэх + алдааны нөхцөлүүдийг шалгана.
 */
describe("CacheFactory", () => {
  // ─── Үүсгэх ─────────────────────────────────────────────

  test("creates LRU cache", () => {
    const cache = CacheFactory.create("lru", { capacity: 5 });
    cache.set("A", 1);
    expect(cache.get("A")).toBe(1);
  });

  test("creates LFU cache", () => {
    const cache = CacheFactory.create("lfu", { capacity: 5 });
    cache.set("A", 1);
    expect(cache.get("A")).toBe(1);
  });

  test("creates TTL cache", () => {
    const cache = CacheFactory.create("ttl", {
      capacity: 5,
      defaultTtlMs: 1000,
    });
    cache.set("A", 1);
    expect(cache.get("A")).toBe(1);
  });

  // ─── Алдааны тестүүд ────────────────────────────────────

  test("throws InvalidConfigError when capacity <= 0", () => {
    expect(() => {
      CacheFactory.create("lru", { capacity: 0 });
    }).toThrow(InvalidConfigError);

    expect(() => {
      CacheFactory.create("lfu", { capacity: -1 });
    }).toThrow(InvalidConfigError);
  });

  test("throws InvalidConfigError when TTL config is missing defaultTtlMs", () => {
    expect(() => {
      CacheFactory.create("ttl", { capacity: 5 });
    }).toThrow(InvalidConfigError);
  });

  test("throws UnknownCacheTypeError for invalid type", () => {
    expect(() => {
      // @ts-expect-error — зориуд буруу type-аар туршиж байгаа
      CacheFactory.create("invalid", { capacity: 5 });
    }).toThrow(UnknownCacheTypeError);
  });
});