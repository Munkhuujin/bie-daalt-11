# А.1 — Муу API-ийн алдааны шинжилгээ

`bad API` болох `usr_mgr` класс нь API дизайны хэд хэдэн зарчмыг зөрчсөн байна.

## 1. Класс, метод, хувьсагчийн нэршил

```typescript
class usr_mgr { ... }
public db_conn: any;
public users_arr: Array<any>;
do_user_op(...)
get_u(...)
```

`user_mgr`, `do_user_op`, `get_u`, `db_conn`, `users_arr` нь богиносгосон, snake_case нэр ашигласан байна.

TypeScript-ийн стандартаар класс нь PascalCase, метод болон хувьсагч camelCase байх ёстой. Богиносгосон нэр нь кодыг уншиж буй хүнд ойлгомжгүй байдал бий болгодог — `db_conn` гэхээс `dbConnection` гэвэл юу болох нь шууд тодорхой харагдана.

**Зассан нь:** `UserManager`, `getUser()`, `dbConnection`, `users`.

---

## 2. Дотоод төлөв ил гарч public болсон

```typescript
public db_conn: any;
public users_arr: Array<any> = [];
```

Дотоод төлөв (Database connection) болон хэрэглэгчийн массив хоёулаа public болсон тул гадны кодоос шууд хандах боломжтой. Энэ нь `usr_mgr.users_arr.push(...)` гэх мэт класcын дотоод төлвийг гадагш эвдэх замыг нээж өгч байна. Encapsulation-ийн гол зарчим зөрчигдсөн.

**Зассан нь:** Эдгээр талбаруудыг private болгох. Хэрэв уншигдах шаардлагатай бол getter метод нэмж өгөх.

---

## 3. any төрлийг хэт их хэрэглэсэн

```typescript
db_conn: any
users_arr: Array<any>
do_user_op(obj: any, ...)
```

Эндээс харахад TypeScript-ийн type шалгалт бараг хэрэггүй болж үлдэж байна. Метод дуудаж буй хэрэглэгч `obj`-д яг юу дамжуулахаа мэдэхгүй — контракт тодорхой биш.

**Зассан нь:** `User`, `CreateUserDto`, `UpdateUserDto` зэрэг тодорхой interface эсвэл type тодорхойлох.

---

## 4. Нэг метод олон үйлдэл хийж байна

```typescript
do_user_op(obj, flag: number, timeout)
// flag 0 = create, 1 = update, 2 = delete, 3 = restore
```

Нэг метод flag параметрээр дамжуулан 4 өөр үйлдэл хийж байна. Хэрэв үүнийг ашиглавал `flag=2` гэдэг нь юу хийдгийг мэдэх боломжгүй байгаа нь асуудал болно. Single Responsibility зарчим зөрчигдөж байна.

**Зассан нь:** Үйлдэл бүрийг тус тусдаа метод болгох:

```typescript
createUser(data: CreateUserDto): User
updateUser(id: string, data: UpdateUserDto): User
deleteUser(id: string): void
restoreUser(id: string): User
```

Хэрэв заавал нэг метод дотор үлдээх шаардлагатай бол `enum UserOperation` ашиглах нь утга тодорхойгүй тоонуудаас илүү дээр.

---

## 5. Алдааг string-ээр буцаах

```typescript
get_u(): string  // returns user as JSON string, or 'ERR_404' string if not found
```

`get_u()` метод нь хэрэглэгч олдохгүй тохиолдолд `'ERR_404'` гэсэн string буцааж байна. Метод нэг удаа User, дараа нь string буцааж тогтворгүй contract үүсгэж байна.

**Зассан нь:** Хэрэглэгч олдохгүй бол `null` буцаах, эсвэл тусгай `UserNotFoundError` exception шидэх. Хоёр аргыг хольж хэрэглэхгүй байх — нэгийг сонгож, нийт API дотор тогтвортой ашиглах.

---

## 6. JSON string буцаах

`get_u()` метод нь хэрэглэгчийн мэдээллийг JSON string хэлбэрээр буцааж байна. Энэ нь хэрэглэгчийг ашиглах бүрт `JSON.parse()` хийх шаардлагатай болгож, нэмэлт ажиллагаа үүсгэж байна.

Мөн serialization логик service дотор орсноор дотоод хэрэгжилт гадагш ил гарч байна. Энэ нь encapsulation-ын зарчимтай нийцэхгүй.

**Зассан нь:** User объектыг шууд буцаах хэрэгтэй. JSON болгон хөрвүүлэх ажлыг controller эсвэл presenter давхаргад хийх нь илүү зөв.

---

## 7. Нэг параметрт хоёр өөр төрлийн ID-г холиж байна

```typescript
get_u(id_or_email: string, flag: number)
```

`get_u(id_or_email: string, flag: number)` метод нь flag-ийн утгаас хамаараад нэг бол ID-аар, нэг бол и-мэйлээр хайдаг.

**Зассан нь:** Хоёр тусдаа метод болгох:

```typescript
getUserById(id: string): User | null
getUserByEmail(email: string): User | null
```

---

## 8. SQLException гадагш гарсан

```typescript
find(q: string): any[]  // throws SQLException
```

Метод нь `SQLException` throw хийнэ гэж тэмдэглэгдсэн байна. Гэхдээ энэ метод нь `UserManager`-ийн public API. Үүнийг ашиглаж буй код нь database тухай мэдэх ёсгүй.

**Зассан нь:** Өөрийн домэйнд тохирсон exception тодорхойлох:

```typescript
class UserRepositoryError extends Error {}
class UserNotFoundError extends UserRepositoryError {}
```

Дотоод `SQLException`-ыг барьж аваад эдгээрийн аль нэг рүү хувиргаж throw хийнэ.

---

## 9. find(q: string) хайлтын нөхцөл тодорхойгүй

```typescript
find(q: string): any[]
```

`find(q: string): any[]` метод нь `q` гэсэн нэг л string параметр хүлээж авч байна. Энэ string нь нэрээр хайдаг уу, и-мэйлээр хайдаг уу, ID-аар хайдаг уу, бүх талбараар хайдаг уу гэдэг нь тодорхойгүй. Документ заавал унших шаардлагатай.

**Зассан нь:** Хайлтын шалгуурыг тодорхой объект болгох:

```typescript
interface UserSearchCriteria {
name?: string;
email?: string;
status?: UserStatus;
createdAfter?: Date;
}

searchUsers(criteria: UserSearchCriteria): User[]
```

Ингэснээр аль талбараар хайж байгаа нь шууд харагдана.

---

## 10. timeout параметр эзэмшил тодорхойгүй

```typescript
do_user_op(obj, flag, timeout: number)
```

`timeout` параметрийг метод бүр дээр дамжуулж байгаа нь жаахан ойлгомжгүй харагдаж байна. Яг ямар нэгжтэй (ms эсвэл секунд) гэдэг нь тодорхойгүй байна.

Би үүнийг config эсвэл constructor руу шилжүүлэх нь илүү цэгцтэй гэж бодож байна. Ингэснээр дахин дахин параметр дамжуулах шаардлагагүй болно.

**Зассан нь:** Timeout-ийг constructor эсвэл тохиргооны объектод төвлөрүүлэх:

```typescript
class UserManager {
  constructor(private config: { timeoutMs: number }) {}
}
```

Эсвэл нэгжийг тодотгох төрөл ашиглах: `Duration` эсвэл `timeoutMs: number`.