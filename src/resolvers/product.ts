import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  Query,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import User from "../entity/User";
import Product from "../entity/Product";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";

@InputType()
export class ProductInput {
  @Field()
  name: string;
  @Field()
  description: string;
  @Field()
  price: number;
}

@Resolver()
export class ProductResolver {
  @Mutation(() => Product, { nullable: true })
  @UseMiddleware(isAuth)
  async addProduct(
    @Arg("options", () => ProductInput)
    options: ProductInput,
    @Ctx() { req }: MyContext
  ): Promise<Product | null> {
    const userId = req?.session?.userId;
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("that user dont exist");
    }
    const product = await Product.create({
      ...options,
      user,
    }).save();

    return product;
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("productId") productId: number) {
    //TODO add authorization, only product owner cau do it
    return await Product.delete(productId)
      .then(() => true)
      .catch(() => false);
  }

  @Query(() => [Product])
  async getAllProducts(@Ctx() { req }: MyContext): Promise<Product[]> {
    //TODO? dont fetch if not logged in
    return await Product.find({
      where: { user: req.session.userId },
      relations: ["user"],
    });
  }
}
