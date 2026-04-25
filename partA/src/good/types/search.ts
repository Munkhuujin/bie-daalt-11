import { UserStatus } from "./user";

/**
 * Хайлтын шалгуур. 
 * Шүүх шаардлагатай талбаруудаа л дамжуулахад хангалттай.
 */
export interface UserSearchCriteria {
  readonly name?: string;
  readonly email?: string;
  readonly status?: UserStatus;
  readonly createdAfter?: Date;
  readonly createdBefore?: Date;
}