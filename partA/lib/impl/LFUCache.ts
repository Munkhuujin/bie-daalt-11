import { Cache } from "../api/Cache";

/**
 * LFU cache хэрэгжилт.
 *
 * Хамгийн цөөн ашиглагдсан key-ийг устгадаг. LRU-аас ялгаатай нь
 * "хэзээ" биш "хэдэн удаа" ашигласанд тулгуурлана.
 *
 * Frequency-г тусдаа Map-нд хадгалаад eviction үед бүгдийг scan хийж
 * хамгийн бага freq-тэйг олох замаар хийсэн. O(n) болохоор production
 * code биш, гэхдээ хичээлийн хэмжээнд хангалттай гэж бодсон.
 *
 * Ижил frequency-тэй олон key байвал эхэнд орсон нь устана —
 * Map-н insertion order ашигласан.
 *
 * @internal Зөвхөн Factory-аар үүсгэнэ.
 */
export class LFUCache<V> implements Cache<V> {
  private readonly map = new Map<string, V>();
  private readonly frequency = new Map<string, number>();
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  /**
   * Утга авна. Олдвол frequency-г 1-ээр нэмнэ.
   */
  get(key: string): V | null {
    if (!this.map.has(key)) return null;

    this.frequency.set(key, (this.frequency.get(key) ?? 0) + 1);

    return this.map.get(key) ?? null;
  }

  /**
   * Утга хадгална. Дүүрсэн бол хамгийн бага freq-тэйг устгана.
   */
  set(key: string, value: V): void {
    if (this.map.has(key)) {
      // Утга шинэчлээд freq-г нэмнэ
      this.map.set(key, value);
      this.frequency.set(key, (this.frequency.get(key) ?? 0) + 1);
      return;
    }

    if (this.map.size >= this.capacity) {
      this.evictLeastFrequent();
    }

    this.map.set(key, value);
    this.frequency.set(key, 1);
  }

  /**
   * Key байгаа эсэх. Freq өөрчлөхгүй.
   */
  has(key: string): boolean {
    return this.map.has(key);
  }

  /**
   * Key устгана.
   */
  delete(key: string): boolean {
    this.frequency.delete(key);
    return this.map.delete(key);
  }

  /**
   * Бүгдийг устгана.
   */
  clear(): void {
    this.map.clear();
    this.frequency.clear();
  }

  /**
   * Одоогийн хэмжээ.
   */
  size(): number {
    return this.map.size;
  }

  /**
   * Хамгийн бага freq-тэй key-г олж устгана.
   * Ижил freq-тэй бол эртний нь устах байдлаар Map-н дарааллыг ашигласан.
   */
  private evictLeastFrequent(): void {
    let minFreq = Infinity;
    let keyToEvict: string | undefined;

    for (const [key, freq] of this.frequency) {
      if (freq < minFreq) {
        minFreq = freq;
        keyToEvict = key;
      }
    }

    if (keyToEvict !== undefined) {
      this.map.delete(keyToEvict);
      this.frequency.delete(keyToEvict);
    }
  }
}