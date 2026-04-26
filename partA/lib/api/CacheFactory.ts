import type { Cache } from "./Cache";
import { LRUCache } from "../impl/LRUCache";
import { TTLCache } from "../impl/TTLCache";
import { InvalidConfigError, UnknownCacheTypeError } from "./errors";

/**
 * Кэшийн төрлүүд.
 */
export type CacheType = "lru" | "lfu" | "ttl";

/**
 * Кэш үүсгэхэд хэрэгтэй үндсэн тохиргоо.
 *
 * @remarks
 * lru, lfu → зөвхөн capacity
 * ttl → capacity + defaultTtlMs шаардлагатай
 */
export interface CacheConfig {
  /** Кэшийн багтаамж (0-ээс их байх ёстой) */
  readonly capacity: number;

  /**
   * TTL кэшийн default хугацаа (ms).
   * Зөвхөн ttl төрөлд хэрэглэгдэнэ.
   */
  readonly defaultTtlMs?: number;
}

/**
 * Кэш үүсгэх factory.
 *
 * Гаднаас шууд LRUCache, TTLCache гэх мэт классуудыг ашиглахгүй,
 * зөвхөн энэ factory-ээр дамжуулж үүсгэнэ.
 *
 * @example
 * const cache = CacheFactory.create<string>("lru", { capacity: 100 });
 */
export class CacheFactory {
/**
   * Төрөл болон тохиргоог нь шалгаж байж кэш үүсгэж өгнө.
   * 
   * @throws {InvalidConfigError} Тохиргоо буруу (0-ээс бага г.м) үед
   * @throws {UnknownCacheTypeError} Танихгүй төрөл ирэх үед
   */
  static create<V>(type: CacheType, config: CacheConfig): Cache<V> {
    // Үндсэн багтаамж 0-ээс их байгааг шалгах
    if (config.capacity <= 0) {
      throw new InvalidConfigError("capacity", "must be greater than 0");
    }

    switch (type) {
      case "lru":
        return new LRUCache<V>(config.capacity);

      case "lfu":
        // TODO: LFUCache-г хэрэгжүүлсний дараа холбоно
        throw new Error("LFU not implemented yet");

      case "ttl":
        if (config.defaultTtlMs === undefined || config.defaultTtlMs <= 0) {
          throw new InvalidConfigError(
            "defaultTtlMs",
            "must be greater than 0 for TTL cache"
          );
        }
        return new TTLCache<V>(config.capacity, config.defaultTtlMs);

      default:
        throw new UnknownCacheTypeError(type);
    }
  }
}