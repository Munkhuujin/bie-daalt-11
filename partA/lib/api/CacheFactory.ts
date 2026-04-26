import type { Cache } from "./Cache";
import { LRUCache } from "../impl/LRUCache";
import { InvalidConfigError, UnknownCacheTypeError } from "./errors";

/**
 * Кэш сангийн төрлүүд.
 */
export type CacheType = "lru" | "lfu" | "ttl";

/**
 * Кэш үүсгэх тохиргооны үндсэн талбарууд.
 *
 * @remarks
 * `lru` ба `lfu` нь зөвхөн `capacity` шаардана.
 * `ttl` нь нэмж `defaultTtlMs` шаардана.
 */
export interface CacheConfig {
  /** Кэшийн дээд хэмжээ (элементийн тоо). Заавал > 0. */
  readonly capacity: number;

  /**
   * TTL кэшэд хэрэглэгдэх default хугацаа (ms).
   * Зөвхөн `type === "ttl"` үед хэрэглэгдэнэ.
   * Заавал > 0.
   */
  readonly defaultTtlMs?: number;
}

/**
 * Concrete кэш хэрэгжилтийг далдалсан Factory.
 *
 * Гадны код зөвхөн энэ factory-ээр дамжин кэш үүсгэнэ —
 * LRUCache, LFUCache, TTLCache гэх class-уудыг шууд import хийхгүй.
 *
 * @example
 *   const cache = CacheFactory.create<string>("lru", { capacity: 100 });
 *   cache.set("user:1", "Munkh");
 */
export class CacheFactory {
  /**
   * Сонгосон төрлийн кэш үүсгэх.
   *
   * @typeParam V Кэшэд хадгалах утгын төрөл
   * @param type Кэшийн төрөл: "lru" | "lfu" | "ttl"
   * @param config Тохиргоо
   * @returns `Cache<V>` интерфейс хэрэгжүүлсэн обьект
   *
   * @throws {InvalidConfigError} `capacity <= 0` эсвэл TTL-д `defaultTtlMs <= 0` үед
   * @throws {UnknownCacheTypeError} `type` нь "lru"|"lfu"|"ttl"-н алинд нь ч таарахгүй үед
   */
  static create<V>(type: CacheType, config: CacheConfig): Cache<V> {
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
        // TODO: TTLCache-г хэрэгжүүлсний дараа холбоно
        throw new Error("TTL not implemented yet");

      default:
        throw new UnknownCacheTypeError(type);
    }
  }
}