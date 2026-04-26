import { Cache } from "../api/Cache";

/**
 * LRU cache implementation.
 *
 * Хамгийн удаан ашиглагдаагүй key-ийг устгаж шинэ entry-д зай гаргана.
 * Map-ийн insertion order ашиглаж LRU-г хялбархан хэрэгжүүлсэн.
 *
 * @internal Энэ class-ийг шууд ашиглахгүй, зөвхөн Factory-аар үүсгэнэ.
 */
export class LRUCache<V> implements Cache<V> {
  private readonly map = new Map<string, V>();
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  /**
   * Key-ийн утгыг авна.
   * Олдвол хамгийн сүүлд ашигласан болгож refresh хийнэ.
   */
  get(key: string): V | null {
    if (!this.map.has(key)) return null;

    const value = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, value);

    return value;
  }

  /**
   * Value хадгална.
   * Capacity дүүрсэн бол хамгийн хуучныг устгана.
   */
  set(key: string, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }

    this.map.set(key, value);
  }

  /**
   * Key байгаа эсэхийг шалгана.
   */
  has(key: string): boolean {
    return this.map.has(key);
  }

  /**
   * Key устгана.
   */
  delete(key: string): boolean {
    return this.map.delete(key);
  }

  /**
   * Cache цэвэрлэх.
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Одоогийн хэмжээ.
   */
  size(): number {
    return this.map.size;
  }
}