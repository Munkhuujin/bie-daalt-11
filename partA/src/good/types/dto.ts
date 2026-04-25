/**
 * Шинэ хэрэглэгч үүсгэхэд ашиглах өгөгдөл.
 * id, createdAt зэргийг систем өөрөө үүсгэх тул энд оруулах шаардлагагүй.
 */
export interface CreateUserDto {
  readonly email: string;
  readonly name: string;
}

/**
 * Хэрэглэгчийн мэдээллийг шинэчлэхэд.
 * Заавал бүх талбарыг дамжуулах албагүй (optional).
 */
export interface UpdateUserDto {
  readonly email?: string;
  readonly name?: string;
}