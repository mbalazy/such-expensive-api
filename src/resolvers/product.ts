import { Resolver, Mutation, Arg, InputType, Field, Query } from "type-graphql";
import User from "../entity/User";
import Product from "../entity/Product";

@InputType()
export class ProductInput {
  @Field()
  name: string;
  @Field()
  description: string;
  @Field()
  price: number;
  @Field()
  userId: number;
}

@Resolver()
export class ProductResolver {
  @Mutation(() => Product, { nullable: true })
  async addProduct(
    @Arg("options", () => ProductInput)
    options: ProductInput
  ): Promise<Product | null> {
    const user = await User.findOne({ id: options.userId });
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

  @Query(() => [Product])
  async fetchProducts(): Promise<Product[]> {
    return await Product.find({ relations: ["user"] });
  }
}
