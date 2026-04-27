export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  available: boolean;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  isbn?: string;
  publishedYear?: number;
  available?: boolean;
}