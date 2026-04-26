/**
 * Кэш дотор гарч болох бүх алдааны эцэг класс.
 * Алдаа барихдаа (catch) `instanceof CacheError` гэж шалгахад амар болгоно.
 */
export class CacheError extends Error {
  constructor(message: string) {
    super(message);
    // TypeScript дээр custom error үүсгэхэд prototype-ийг нь зааж өгөх хэрэгтэй байдаг
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
  }
}

/**
 * Тохиргооны утга буруу (сөрөг тоо г.м) үед ашиглана.
 */
export class InvalidConfigError extends CacheError {
  constructor(public readonly field: string, public readonly reason: string) {
    super(`Тохиргоо буруу байна — ${field}: ${reason}`);
  }
}

/**
 * Байхгүй төрлийн кэш хүсэх үед шиднэ.
 */
export class UnknownCacheTypeError extends CacheError {
  constructor(public readonly type: string) {
    super(`"${type}" гэсэн кэшийн төрөл байхгүй байна. LRU, LFU, эсвэл TTL-г сонгоно уу.`);
  }
}