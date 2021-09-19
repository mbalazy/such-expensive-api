import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  Field,
  Int,
  ObjectType,
  Ctx,
} from "type-graphql";
import argon2 from "argon2";
import User from "../entity/User";
import Product from "../entity/Product";
import CartItem from "../entity/CartItem";
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

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
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

  @Mutation(() => UserResponse, { nullable: true })
  async register(
    @Arg("options")
    options: RegisterInput
  ): Promise<UserResponse> {
    const existingUser = await User.findOne({ email: options.email });
    if (existingUser)
      return {
        errors: [
          { field: "email", message: "User with this email already exist" },
        ],
      };
    //TODO name >3 chars, pass >6 chars valid email

    const hashedPassword = await argon2.hash(options.password);
    const user = User.create({
      name: options.name,
      password: hashedPassword,
      email: options.email,
    });

    await user.save();
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

    //storing userId in session, we can add here what we want
    //ustawiajac to zapisuje sie cookie w przegladarce
    //za kazdym razem jak przegladarka bedzie wysylac zapytanie
    //to cookie bedzie 'zalaczone; i bedzie wiadomo kto jest zalogowany
    req.session.userId = user.id;

    return {
      user,
    };
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
