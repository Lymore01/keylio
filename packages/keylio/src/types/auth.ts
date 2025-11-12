export interface UserType {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

export interface SessionType {
  id?: string;
  userId: string;
  sessionToken: string;
  expires: Date;
  createdAt?: Date;
  updatedAt?: Date;
}