import { User } from "../dto/user.dto";

export class UserUseCases {
  async create(data: User): Promise<User> {
    if (!data.role || (data.role !== "admin" && data.role !== "user")) {
      throw new Error("Invalid role");
    }

    return data;
  }
}
