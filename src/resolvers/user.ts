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
import Product from "../entity/Product";

//TODO move to new file
@InputType()
export class LoginInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
class CartInput {
  @Field()
  productId: number;
  @Field()
  userId: number;
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
  async user(
    @Arg("userId", () => Int) userId: number
  ): Promise<User | undefined> {
    return User.findOne({ where: { id: userId }, relations: ["products"] });
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

  @Mutation(() => Boolean)
  async addToCart(
    @Arg("options", () => CartInput) { userId, productId }: CartInput
  ): Promise<boolean> {
    const user = await User.findOne(userId);
    const product = await Product.findOne(productId);
    if (!user || !product) return false;

    user.cart = [...user.cart, product];

    await user.save();
    return true;
  }
}
