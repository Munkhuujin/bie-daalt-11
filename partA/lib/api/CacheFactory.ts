import type { Cache } from "./Cache";
import { LRUCache } from "../impl/LRUCache";
import { InvalidConfigError, UnknownCacheTypeError } from "./errors";

/**
 * Кэшийн төрлүүд.
 */
export type CacheType = "lru" | "lfu" | "ttl";

/**
 * Кэшийн үндсэн тохиргоо.
 *
 * @remarks
 * lru, lfu → зөвхөн capacity ашиглана
 * ttl → нэмээд defaultTtlMs шаардлагатай
 */
export interface CacheConfig {
  /** Кэшийн дээд хэмжээ */
  readonly capacity: number;

  /** TTL кэшийн default хугацаа (ms) */
  readonly defaultTtlMs?: number;
}

/**
 * Кэш үүсгэх Factory.
 *
 * Бүх concrete cache-уудыг нууж, зөвхөн энэ entry point-оор ашиглана.
 */
export class CacheFactory {
  /**
   * Кэш үүсгэнэ.
   */
  static create<V>(type: CacheType, config: CacheConfig): Cache<V> {
    if (config.capacity <= 0) {
      throw new InvalidConfigError("capacity", "must be > 0");
    }

    switch (type) {
      case "lru":
        return new LRUCache<V>(config.capacity);

      case "lfu":
        throw new Error("LFU not implemented");

      case "ttl":
        if (!config.defaultTtlMs || config.defaultTtlMs <= 0) {
          throw new InvalidConfigError(
            "defaultTtlMs",
            "must be > 0 for TTL"
          );
        }
        throw new Error("TTL not implemented");

      default:
        throw new UnknownCacheTypeError(type);
    }
  }
}