import { Cache } from "../api/Cache";

/**
 * TTL (Time To Live) кэш.
 * 
 * Өгөгдөл бүр тодорхой хугацаанд л хүчинтэй байна.
 * Хэт ачаалал үүсгэхгүйн тулд автомат таймер ашиглаагүй,
 * харин get/has хийх үед нь хугацааг нь шалгаж устгадаг (Lazy delete).
 * Дүүрсэн үед хамгийн эхний элементийг гаргана (FIFO).
 */
export class TTLCache<V> implements Cache<V> {
  // Өгөгдлийг хугацаатай нь (expireAt) Map-д хадгална.
  private readonly map = new Map<string, { value: V; expireAt: number }>();
  private readonly capacity: number;
  private readonly defaultTtlMs: number;

  constructor(capacity: number, defaultTtlMs: number) {
    this.capacity = capacity;
    this.defaultTtlMs = defaultTtlMs;
  }

  // Хугацаа дууссан бол устгаад null буцаана
  get(key: string): V | null {
    const entry = this.map.get(key);
    if (!entry) return null;

    if (Date.now() >= entry.expireAt) {
      this.map.delete(key);
      return null;
    }

    return entry.value;
  }

  // Шинэ утга нэмэх. Дүүрсэн үед хамгийн хуучныг нь хасна.
  set(key: string, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Map-ийн хамгийн эхний элементийг авах
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) this.map.delete(oldestKey);
    }

    const expireAt = Date.now() + this.defaultTtlMs;
    this.map.set(key, { value, expireAt });
  }

  // Ключ идэвхтэй байгаа эсэхийг шалгах
  has(key: string): boolean {
    const entry = this.map.get(key);
    if (!entry) return false;

    if (Date.now() >= entry.expireAt) {
      this.map.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
  }

  // Одоо байгаа нийт элементийн тоо
  size(): number {
    return this.map.size;
  }
}