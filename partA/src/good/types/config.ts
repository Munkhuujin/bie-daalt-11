/**
 * Менежер классын үндсэн тохиргоо.
 * timeoutMs: DB үйлдлийг хүлээх дээд хугацаа (ms).
 */
export interface UserManagerConfig {
  /** Database үйлдлийн timeout (миллисекундээр). */
  readonly timeoutMs: number;

  /** Нэг хүсэлтэд буцаах хэрэглэгчийн тоо (pagination-д). */
  readonly defaultPageSize?: number;
}