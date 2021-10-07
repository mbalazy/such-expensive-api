import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import argon2 from "argon2";
import User from "../entity/User";
import { MyContext } from "../types";
import {
  LoginInput,
  RegisterInput,
  UserResponse,
} from "../utils/inputsAndFields";
import { isAuth } from "../middleware/isAuth";
import Cart from "../entity/Cart";

@Resolver()
export class UserResolver {
  @Mutation(() => String)
  async hello(@Arg("string") string: string) {
    return string;
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() { req }: MyContext) {
    return await User.findOne({ where: { id: req.session.userId } });
  }

  @Mutation(() => UserResponse, { nullable: true })
  async register(
    @Arg("options")
    options: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    //TODO name >3 chars, pass >6 chars, valid email
    try {
      const hashedPassword = await argon2.hash(options.password);
      //TODO create User and Cart in one query, entity manager
      const user = await User.create({
        name: options.name,
        password: hashedPassword,
        email: options.email,
      }).save();
      await Cart.create({ userId: user.id }).save();
      req.session.userId = user.id;
      return {
        user,
      };
    } catch (err: any) {
      return err?.detail?.includes("already exist")
        ? {
            errors: [
              { field: "email", message: "User with this email already exist" },
            ],
          }
        : {
            errors: [
              { field: "email", message: "Error while creating new account" },
            ],
          };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options")
    options: LoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ email: options.email });
    //TODO add already logged in error
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
    //check if user is logged in
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
}
