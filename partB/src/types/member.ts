export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinedAt: string; // ISO date string
}

export interface CreateMemberDto {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateMemberDto {
  name?: string;
  email?: string;
  phone?: string;
}