export interface User {
  name: string;
  email: string;
  role: string;
  isOnboarded: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}
