import {
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  NotAuthorizedException,
  SignUpCommand,
  UserNotConfirmedException,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognito } from "../../config/aws/congnito.config";
import { UserDto } from "../dto/user.dto";
import { UserRepository } from "../repository/user.repository";

export class UserUseCases {
  private userRepository = new UserRepository();

  async singinOrRegister(data: UserDto): Promise<UserDto | any> {
    if (!data.role || (data.role !== "admin" && data.role !== "user")) {
      throw new Error("Invalid role!");
    }

    if (!data.email || !data.password)
      throw new Error("Email and Password requitred");

    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      try {
        const authCommand = new InitiateAuthCommand({
          ClientId: process.env.COGNITO_CLIENT_ID,
          AuthFlow: "USER_PASSWORD_AUTH",
          AuthParameters: {
            USERNAME: data.email,
            PASSWORD: data.password,
          },
        });

        const signInResponse = await cognito.send(authCommand);

        return (
          {
            token: signInResponse.AuthenticationResult?.IdToken,
            refresh_token: signInResponse.AuthenticationResult?.RefreshToken,
          } || "Login failed, no token received"
        );
      } catch (err) {
        if (err instanceof NotAuthorizedException)
          throw new Error(String(err["message"]));
        if (err instanceof UserNotFoundException)
          throw new Error(String(err["message"]));
        if (err instanceof UserNotConfirmedException)
          throw new Error(String(err["message"]));
      }
    } else {
      try {
        const signUpCommand = new SignUpCommand({
          ClientId: process.env.COGNITO_CLIENT_ID,
          Username: data.email,
          Password: data.password,
          UserAttributes: [
            {
              Name: "email",
              Value: data.email,
            },
            {
              Name: "name",
              Value: data.name,
            },
            {
              Name: "custom:role",
              Value: data.role,
            },
          ],
        });

        const registerResponse = await cognito.send(signUpCommand);
        const savedUser = await this.userRepository.create(data);

        return savedUser;
      } catch (err) {
        throw new Error("Error during registration in Cognito!");
      }
    }
  }

  async confirmationAccount(email: string, code: string) {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
      });

      await cognito.send(command);
    } catch (e) {
      throw new Error("Internal Server Error");
    }
  }

  async find(): Promise<UserDto[]> {
    return await this.userRepository.find();
  }

  async me(email: string): Promise<UserDto> {
    const find = await this.userRepository.findByEmail(email);
    if (!find) throw new Error("user not exists!");

    return find;
  }

  async update(email: string, data: UserDto): Promise<UserDto> {
    const find = await this.userRepository.findByEmail(email);

    if (!find) throw new Error("user not exists!");

    const update = await this.userRepository.update(email, data);

    return update;
  }

  async delete(id: number): Promise<UserDto> {
    const find = await this.userRepository.findById(id);

    if (!find) throw new Error("user not exists!");

    const del = await this.userRepository.delete(find);

    return del;
  }
}
