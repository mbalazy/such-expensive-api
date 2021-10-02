import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity()
@ObjectType()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column("text", { unique: true })
  @Field()
  email: string;

  @Column()
  password: string;

  @Column("text", { nullable: true })
  phone: string;

  //TODO need to move to own entity with city, post etc.
  @Column("text", { nullable: true })
  @Field({ nullable: true })
  adress: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}

export default User;
