export interface UserDto {
  name?: string;
  password?: string;
  email?: string;
  role?: string;
  isOnboarded: number;
  created_at?: Date;
  deleted_at?: Date;
  updated_at?: Date;
}
