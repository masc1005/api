import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database/database.config";
import { User } from "../../config/database/entities/user.entity";
import { UserDto } from "../dto/user.dto";

export class UserRepository {
  private launchesRepository: Repository<User>;

  constructor() {
    this.launchesRepository = AppDataSource.getRepository(User);
  }

  async create(data: UserDto): Promise<User> {
    const user = this.launchesRepository.create({
      created_at: new Date(),
      ...data,
    });
    return await this.launchesRepository.save(user);
  }

  async find(): Promise<User[]> {
    return await this.launchesRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.launchesRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.launchesRepository.findOne({
      where: { id },
    });
  }

  async update(email: string, data: UserDto): Promise<User> {
    const update = await this.launchesRepository.update(
      { email },
      {
        updated_at: new Date(),
        ...data,
      }
    );

    if (update.affected === 0) {
      throw new Error(`User with email ${email} not found.`);
    }

    // Busque e retorne o usuário atualizado
    const updatedUser = await this.launchesRepository.findOne({
      where: { email },
    });

    if (!updatedUser) {
      throw new Error(`User with email ${email} not found.`);
    }

    return updatedUser;
  }

  async delete(data: UserDto): Promise<User> {
    const del = await this.launchesRepository.delete(data);

    return del.raw[0];
  }
}
