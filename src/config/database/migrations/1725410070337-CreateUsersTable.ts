import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1725410070337 implements MigrationInterface {
  name = "CreateUsersTable1725410070337";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "role",
            type: "enum",
            enum: ["user", "admin"],
            default: "'user'",
            isNullable: false,
          },
          {
            name: "isOnboarded",
            type: "int",
            default: 0,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "date",
            isNullable: true,
          },
          {
            name: "updated_at",
            type: "date",
            isNullable: true,
          },
          {
            name: "deleted_at",
            type: "date",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
