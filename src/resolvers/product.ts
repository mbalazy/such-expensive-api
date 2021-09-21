import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  Query,
  Ctx,
} from "type-graphql";
import User from "../entity/User";
import Product from "../entity/Product";
import { MyContext } from "src/types";

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
  async addProduct(
    @Arg("options", () => ProductInput)
    options: ProductInput,
    @Ctx() { req }: MyContext
  ): Promise<Product | null> {
    const userId = req.session.userId;
    if (!userId) return null;
    const user = await User.findOne({ id: userId });
    if (!user) return null;

    const product = Product.create({
      name: options.name,
      description: options.description,
      price: options.price,
      user,
    });

    await product.save();
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
  async fetchAllProducts(@Ctx() { req }: MyContext): Promise<Product[]> {
    return await Product.find({
      where: { user: req.session.userId },
      relations: ["user"],
    });
  }
}
