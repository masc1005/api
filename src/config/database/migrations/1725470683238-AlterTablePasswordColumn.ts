import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTablePasswordColumn1725470683238
  implements MigrationInterface
{
  name = "AlterTablePasswordColumn1725470683238";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "password",
        type: "varchar",
        isNullable: false,
        length: "255",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "password");
  }
}
