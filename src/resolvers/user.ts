import { Resolver, Query, Mutation, Arg, InputType, Field } from "type-graphql";
import argon2 from "argon2";
import User from "../entity/User";

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
  firstName: string;
  @Field()
  lastName: string;
}
//end todo

@Resolver()
export class UserResolver {
  //what to return from graphql schema
  @Query(() => String)
  //what return from resolver
  async hello(): Promise<string> {
    return "hello";
  }

  @Mutation(() => String)
  //first is var for schema, sec is used in function
  async register(
    @Arg("options", () => RegisterInput)
    options: RegisterInput
  ): Promise<User> {

    const hashedPassword = await argon2.hash(options.password);
    const user = User.create({
      firstName: options.firstName,
      lastName: options.lastName,
      password: hashedPassword,
      email: options.email,
    });

    return user;
  }
}
