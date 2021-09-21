import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import User from "../entity/User";
import Product from "../entity/Product";
import CartItem from "../entity/CartItem";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class CartResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addToCart(
    @Arg("productId") productId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
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
