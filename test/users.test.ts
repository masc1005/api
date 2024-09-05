import { UserUseCases } from "../src/app/use_cases/user.use_cases";
import { UserRepository } from "../src/app/repository/user.repository";
import { cognito } from "../src/config/aws/congnito.config";
import {
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  NotAuthorizedException,
  UserNotFoundException,
  UserNotConfirmedException,
} from "@aws-sdk/client-cognito-identity-provider";
import { AppDataSource } from "../src/config/database/database.config";

jest.mock("@aws-sdk/client-cognito-identity-provider");
jest.mock("../src/config/aws/congnito.config");
jest.mock("../src/app/repository/user.repository");

describe("UserUseCases", () => {
  let userUseCases: UserUseCases;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userUseCases = new UserUseCases();
    jest.clearAllMocks();
  });

  describe("singinOrRegister", () => {
    it("should throw an error for invalid role", async () => {
      return await expect(
        userUseCases.singinOrRegister({
          email: "test@example.com",
          password: "password123",
          role: "invalid",
          isOnboarded: 0,
          name: "name",
        })
      ).rejects.toThrow("Invalid role!");
    });

    it("should throw an error if email or password is missing", async () => {
      await expect(
        userUseCases.singinOrRegister({
          email: "",
          password: "",
          role: "user",
          isOnboarded: 0,
        })
      ).rejects.toThrow("Email and Password requitred");
    });

    // it("should sign in an existing user", async () => {
    //   const mockAuthResponse = {
    //     AuthenticationResult: {
    //       IdToken: "idToken",
    //       RefreshToken: "refreshToken",
    //     },
    //   };

    //   (cognito.send as jest.Mock).mockResolvedValue(mockAuthResponse);

    //   mockUserRepository.findByEmail.mockResolvedValue({
    //     id: 1,
    //     name: "John Doe",
    //     email: "test@example.com",
    //     password: "hashed_password",
    //     role: "user",
    //     isOnboarded: 0,
    //   });

    //   const result = await userUseCases.singinOrRegister({
    //     email: "test@example.com",
    //     password: "password123",
    //     role: "user",
    //     isOnboarded: 0,
    //   });

    //   expect(result).toEqual({
    //     token: "idToken",
    //     refresh_token: "refreshToken",
    //   });
    // });

    // it("should handle sign in errors", async () => {
    //   (cognito.send as jest.Mock).mockRejectedValue(
    //     new NotAuthorizedException({
    //       message: "Incorrect username or password",
    //       $metadata: {},
    //     })
    //   );

    //   mockUserRepository.findByEmail.mockResolvedValue({
    //     id: 1,
    //     name: "John Doe",
    //     email: "test@example.com",
    //     password: "hashed_password",
    //     role: "user",
    //     isOnboarded: 0,
    //   });

    //   await expect(
    //     userUseCases.singinOrRegister({
    //       email: "test@example.com",
    //       password: "password123",
    //       role: "user",
    //       isOnboarded: 0,
    //     })
    //   ).rejects.toThrow("Incorrect username or password");
    // });

    // it("should register a new user if user does not exist", async () => {
    //   mockUserRepository.findByEmail.mockResolvedValue(null);

    //   const mockSignUpResponse = { UserSub: "123" };
    //   (cognito.send as jest.Mock).mockResolvedValue(mockSignUpResponse);

    //   mockUserRepository.create.mockResolvedValue({
    //     id: 1,
    //     name: "John Doe",
    //     email: "test@example.com",
    //     password: "password123",
    //     role: "user",
    //     isOnboarded: 0,
    //   });

    //   const result = await userUseCases.singinOrRegister({
    //     email: "test@example.com",
    //     password: "password123",
    //     role: "user",
    //     isOnboarded: 0,
    //   });

    //   expect(result).toEqual({
    //     id: 1,
    //     name: "John Doe",
    //     email: "test@example.com",
    //     password: "password123",
    //     role: "user",
    //     isOnboarded: false,
    //   });

    //   expect(mockUserRepository.create).toHaveBeenCalledWith({
    //     email: "test@example.com",
    //     password: "password123",
    //     role: "user",
    //     name: "John Doe",
    //     isOnboarded: false,
    //   });
    // });
  });

  describe("confirmationAccount", () => {
    it("should confirm account successfully", async () => {
      (cognito.send as jest.Mock).mockResolvedValue({});

      await expect(
        userUseCases.confirmationAccount("test@example.com", "123456")
      ).resolves.not.toThrow();
      expect(cognito.send).toHaveBeenCalledWith(
        expect.any(ConfirmSignUpCommand)
      );
    });

    it("should throw an error if confirmation fails", async () => {
      (cognito.send as jest.Mock).mockRejectedValue(
        new Error("Internal Server Error")
      );

      await expect(
        userUseCases.confirmationAccount("test@example.com", "123456")
      ).rejects.toThrow("Internal Server Error");
    });
  });

  describe("me", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      mockUserRepository.findByEmail = jest.fn();
    });
    // it("should return user details if user exists", async () => {
    //   const mockUser = {
    //     id: 1,
    //     name: "Leoni",
    //     email: "leonimascarenhas@gmail.com",
    //     password: "123554sd5456443",
    //     role: "user",
    //     isOnboarded: 0,
    //   };

    //   mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    //   const result = await userUseCases.me("leonimascarenhas@gmail.com");

    //   expect(result).toEqual(mockUser);

    //   expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
    //     "leonimascarenhas@gmail.com"
    //   );
    // });

    it("should throw an error if user does not exist", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(userUseCases.me("test@example.com")).rejects.toThrow(
        "user not exists!"
      );
    });
  });
});
