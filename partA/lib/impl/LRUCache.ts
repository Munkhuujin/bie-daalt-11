import type { Cache } from "../api/Cache";

/**
 * LRU (Least Recently Used) кэш хэрэгжилт.
 *
 * Хамгийн саяхан ашиглаагүй ключийг устгадаг — кэш дүүрсэн үед
 * хамгийн эртний `get`/`set` хийгдсэн ключийг гаргаж шинэ ключийг оруулдаг.
 *
 * JavaScript-ийн `Map` нь оруулсан дарааллыг хадгалдаг учраас үүнийг
 * "хамгийн эртний" болон "хамгийн шинэ"-г илэрхийлэхэд ашигласан:
 *   - Map-ийн эхний элемент = хамгийн эртний ашигласан
 *   - Map-ийн сүүлийн элемент = хамгийн саяхан ашигласан
 *
 * `get` болон `set` үед ключийг устгаад дахин нэмэх замаар "шинэ" болгоно.
 *
 * @typeParam V Кэшэд хадгалах утгын төрөл
 *
 * @internal Энэ class-ийг гадагш export хийхгүй —
 *           гадны код зөвхөн `CacheFactory.create("lru", ...)` ашиглана.
 */
export class LRUCache<V> implements Cache<V> {
  private readonly map = new Map<string, V>();
  private readonly capacity: number;

  /**
   * @param capacity Кэшийн дээд хэмжээ. CacheFactory-аас дамжуулагдана,
   *                 Factory нь capacity > 0 гэдгийг шалгасан байх ёстой.
   */
  constructor(capacity: number) {
    this.capacity = capacity;
  }

  /**
   * Ключийн утгыг авах. Хэрэв олдвол энэ ключ "хамгийн саяхан ашигласан"
   * болж хувирна (Map-ийн төгсгөлд шилжинэ).
   */
  get(key: string): V | null {
    if (!this.map.has(key)) {
      return null;
    }

    // Map-аас гаргаад дахин нэмэх → дараалал шинэчлэгдэнэ
    const value = this.map.get(key) as V;
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  /**
   * Утга хадгалах. Хэрэв ключ байсан бол шинэчилнэ.
   * Хэрэв capacity дүүрсэн бол хамгийн эртний ашигласан ключийг устгана.
   */
  set(key: string, value: V): void {
    // Хэрэв ключ аль хэдийн байгаа бол устгаад дахин нэмнэ
    // (дараалал шинэчлэгдэнэ)
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Capacity дүүрсэн → эхний (хамгийн эртний) ключийг устгана
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }

    this.map.set(key, value);
  }

  /**
   * Ключ байгаа эсэхийг шалгах.
   * `get`-аас ялгаатай нь — энэ үйлдэл "ашиглалт" гэж тооцогдохгүй,
   * Map-ийн дараалал өөрчлөгдөхгүй.
   */
  has(key: string): boolean {
    return this.map.has(key);
  }

  /**
   * Ключийг устгах.
   */
  delete(key: string): boolean {
    return this.map.delete(key);
  }

  /**
   * Бүх элементийг устгах.
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Одоогийн элементийн тоо.
   */
  size(): number {
    return this.map.size;
  }
}