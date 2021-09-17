import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  Field,
  Int,
} from "type-graphql";
import argon2 from "argon2";
import User from "../entity/User";
import Product from "../entity/Product";
import CartItem from "../entity/CartItem";

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

  @Mutation(() => User, { nullable: true })
  async register(
    @Arg("options")
    options: RegisterInput
  ): Promise<User | null> {
    const existingUser = await User.findOne({ email: options.email });
    if (existingUser) return null;

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

  //TODO create cart resolver and move it there
  @Mutation(() => Boolean)
  async addToCart(
    @Arg("options") { userId, productId }: CartInput
  ): Promise<boolean> {
    const user = await User.findOne(userId);
    const product = await Product.findOne(productId);
    //TODO better error handling
    if (!user || !product) return false;

    const existingCartItem = await CartItem.findOne({
      relations: ["product"],
      where: { user, product },
    });

    if (!existingCartItem) {
      CartItem.create({
        user,
        product,
        quantity: 1,
      }).save();
    } else {
      existingCartItem.quantity++;
      existingCartItem.save();
    }

    return true;
  }
}
