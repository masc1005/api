import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  email!: string;

  @Column({ default: "user" })
  role: string = "admin" || "User";

  @Column({ default: 0 })
  isOnboarded!: number;

  @Column({ nullable: true })
  created_at?: Date;

  @Column({ nullable: true })
  update_at?: Date;

  @Column({ nullable: true })
  deleted_at?: Date;
}
