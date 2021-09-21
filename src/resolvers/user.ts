import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import argon2 from "argon2";
import User from "../entity/User";
import Product from "../entity/Product";
import CartItem from "../entity/CartItem";
import { MyContext } from "src/types";
import {
  LoginInput,
  RegisterInput,
  UserResponse,
} from "../utils/inputsAndFields";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    const userId = req.session.userId;
    // no userid on session? not logged
    if (!userId) {
      return null;
    }

    return await User.findOne({
      where: { id: userId },
      relations: ["products"],
    });
  }

  @Mutation(() => UserResponse, { nullable: true })
  async register(
    @Arg("options")
    options: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const existingUser = await User.findOne({ email: options.email });
    if (existingUser)
      return {
        errors: [
          { field: "email", message: "User with this email already exist" },
        ],
      };
    //TODO name >3 chars, pass >6 chars, valid email

    const hashedPassword = await argon2.hash(options.password);
    const user = User.create({
      name: options.name,
      password: hashedPassword,
      email: options.email,
    });

    await user.save();
    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options")
    options: LoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ email: options.email });
    if (!user) {
      return {
        errors: [
          { field: "email", message: "User with this email dont exist" },
        ],
      };
    }

    const validPassword = await argon2.verify(user.password, options.password);
    if (!validPassword) {
      return {
        errors: [{ field: "password", message: "Invalid password" }],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    //check if user is logged
    return !req.session.userId
      ? false
      : new Promise((resolve) =>
          req.session.destroy((err) => {
            res.clearCookie(process.env.SESSION_NAME as string);
            if (err) {
              console.log("error with session destroy ", err);
              resolve(false);
              return;
            }
            resolve(true);
          })
        );
  }

  //TODO create cart resolver and move it there
  @Mutation(() => Boolean)
  async addToCart(
    @Arg("productId") productId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    if (!req.session.userId) {
      return false;
    }
    //TODO maybe dont fetch/add all user, just add userId
    const user = await User.findOne(req.session.userId);
    const product = await Product.findOne(productId);
    //TODO better error handling
    if (!user || !product) return false;

    const existingCartItem = await CartItem.findOne({
      where: { user, product },
      relations: ["product"],
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
