/**
 * Хэрэглэгчийн үндсэн модель ба төлөвийн тодорхойлолт.
 * Хэрэглэгчийн системд байх боломжтой төлөвүүд.
 * Ингэж Enum ашиглах нь "Magic string" ашиглахаас илүү аюулгүй.
 */
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

/**
 * Хэрэглэгчийн үндсэн бүтэц (Domain Entity).
 * readonly ашигласан нь объектын талбаруудыг санамсаргүйгээр 
 * өөрчлөхөөс сэргийлж, кодын тогтвортой байдлыг хангаж байна.
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly status: UserStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}