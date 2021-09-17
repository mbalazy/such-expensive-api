import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
  Int,
} from "type-graphql";
import argon2 from "argon2";
import User from "../entity/User";
import { MyContext } from "src/types";

//TODO move to new file
@InputType()
export class LoginInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
export class RegisterInput extends LoginInput {
  @Field()
  name: string;
}
//end todo

@Resolver()
export class UserResolver {
  //graphql/schema type
  @Query(() => String)
  //typescript/resolver type
  async hello(@Ctx() ctx: MyContext): Promise<string> {
    console.log(ctx.hi);
    return "hello";
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find({});
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => Int) id: number): Promise<User | undefined> {
    return User.findOne({ where: { id }, relations: ["products"] });
  }

  @Mutation(() => User)
  async register(
    @Arg("options", () => RegisterInput)
    options: RegisterInput
  ): Promise<User> {
    const hashedPassword = await argon2.hash(options.password);
    const user = User.create({
      name: options.name,
      password: hashedPassword,
      email: options.email,
    });

    await user.save();
    console.log(user);
    return user;
  }
}
