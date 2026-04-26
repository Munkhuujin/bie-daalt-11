/**
 * Энэ файл бол сангийн "үүд хаалга" юм.
 * Гадны хөгжүүлэгч зөвхөн энэ файлаас import хийж ажиллана.
 * Дотоод хавтас (impl/) руу орох шаардлагагүй.
 */
export type { Cache } from "./Cache";
export { CacheFactory, type CacheType, type CacheConfig } from "./CacheFactory";
export {
  CacheError,
  InvalidConfigError,
  UnknownCacheTypeError,
} from "./errors";