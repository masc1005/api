import { User } from "../src/app/dto/user.dto";
import { UserUseCases } from "../src/app/use_case/user.use_cases";

describe("create user test", () => {
  const user: User = {
    name: "Leoni",
    email: "leoni@example.com",
    role: "admin",
    isOnboarded: 1,
  };

  const userUseCase = new UserUseCases();

  it("should create a user without errors", async () => {
    const savedUser = await userUseCase.create(user);

    expect(savedUser["id"]).toBeDefined();
    expect(savedUser.name).toBe(user.name);
    expect(savedUser.email).toBe(user.email);
    expect(savedUser.role).toBe(user.role);
    expect(savedUser.isOnboarded).toBe(user.isOnboarded);
    expect(savedUser.createdAt).toBeDefined();
  });

  it("should throw an error for invalid user role", async () => {
    const invalidUser = { ...user, role: "asdadasdasd" };

    await expect(userUseCase.create(invalidUser)).rejects.toThrow(
      "Invalid role"
    );
  });
});
