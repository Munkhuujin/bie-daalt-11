# bie-daalt-11
• Оюутны нэр: М.Мөнхүүжин, 
• Код: B242270135, 
• Лаб: 2-5

• Хийсэн ажлын товч тойм (2-3 догол мөр)

• А хэсэг, Б хэсгийг тус тусад нь ажиллуулах тушаал

• Тулгарсан бэрхшээл ба хэрхэн шийдсэн товч тэмдэглэл

• Дүгнэлт — юу сурсан, юуг нь сайжруулж болох байсан


Хийсэн ажлын тайлан:
Commit 1:
Repo үүсгэсэн

Commit 2:
partA, partB folder үүсгэсэн. 

Commit 3:
Bad API-ийг шинжлэн, 10 алдаа олж илрүүлсэн ба хэрхэн сайжруулах талаар тайлбар partA README.md-д бичсэн.

Commit 4:
Сайжруулсан API-ийн бүтцийг үүсгэсэн.
( src/good/ дотор types/, errors/ ) фолдер үүсгэсэн.

Good API бүтцийн товч тайлбар:

src/good/ фолдерт дараах байдлаар хуваав:

- **types/** — өгөгдлийн төрлүүд
  - user.ts — User interface, UserStatus enum
  - dto.ts — CreateUserDto, UpdateUserDto
  - search.ts — UserSearchCriteria
  - config.ts — UserManagerConfig
  - index.ts — нэгдсэн export

- **errors/** — домэйн алдаанууд
  - UserManagerError.ts — суурь алдааны класс
  - UserNotFoundError.ts, DuplicateEmailError.ts,
    InvalidInputError.ts, RepositoryError.ts — тусгай алдаанууд
  - index.ts — нэгдсэн export

- **UserManager.ts** — гол менежер класс
- **index.ts** — public API
