import type { Cache } from "./Cache";
import { InvalidConfigError, UnknownCacheTypeError } from "./errors";

export type CacheType = "lru" | "lfu" | "ttl";

export interface CacheConfig {
  readonly capacity: number;
  readonly defaultTtlMs?: number;
}

/**
 * Кэш үүсгэх ажлыг хариуцах үйлдвэр (Factory).
 * 
 * Гаднаас шууд классуудыг (LRUCache г.м) дуудаж болохгүй. 
 * Заавал энэ Factory-г ашиглаж кэшээ үүсгэнэ. Ингэснээр
 * бид мэдээллийн далдлалтыг (Abstraction) хангаж байгаа юм.
 */
export class CacheFactory {
  /**
   * Төрөл болон тохиргоог нь өгөөд кэш үүсгэж авна.
   */
  static create<V>(type: CacheType, config: CacheConfig): Cache<V> {
    // Тохиргооны утгуудыг шалгах
    if (config.capacity <= 0) {
      throw new InvalidConfigError("capacity", "0-ээс их байх ёстой");
    }

    switch (type) {
      case "lru":
        // TODO: LRUCache-г implement хийсний дараа энд холбоно
        throw new Error("LRU хэрэгжүүлэлт хараахан бэлэн болоогүй байна.");
      case "lfu":
        throw new Error("LFU хэрэгжүүлэлт хараахан бэлэн болоогүй байна.");
      case "ttl":
        if (!config.defaultTtlMs || config.defaultTtlMs <= 0) {
          throw new InvalidConfigError("defaultTtlMs", "TTL кэшэд хугацаа заавал зааж өгөх ёстой");
        }
        throw new Error("TTL хэрэгжүүлэлт хараахан бэлэн болоогүй байна.");
      default:
        throw new UnknownCacheTypeError(type);
    }
  }
}