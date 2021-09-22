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
  @Query(() => [Product])
  @UseMiddleware(isAuth)
  async getAllProducts(@Ctx() { req }: MyContext): Promise<Product[]> {
    return await Product.find({ where: { user: req.session.userId } });
  }

  @Mutation(() => Product)
  @UseMiddleware(isAuth)
  async addProduct(
    @Arg("options", () => ProductInput)
    options: ProductInput,
    @Ctx() { req }: MyContext
  ): Promise<Product | null> {
    return Product.create({
      ...options,
      userId: req.session.userId,
    }).save();
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("productId") productId: number) {
    //TODO add authorization, only product owner cau do it
    return await Product.delete(productId)
      .then(() => true)
      .catch(() => false);
  }
}
