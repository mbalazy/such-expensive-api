import {
  Resolver,
  Mutation,
  Query,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
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
    //TODO dry -> same in removeFromCart
    const product = await Product.findOne(productId);
    if (!product) return false;

    const userId = req.session.userId;
    const existingCartItem = await CartItem.findOne({
      where: { userId, product },
      relations: ["product"],
    });

    if (!existingCartItem) {
      CartItem.create({
        userId,
        product,
        quantity: 1,
      }).save();
    } else {
      existingCartItem.quantity++;
      existingCartItem.save();
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async removeFromCart(
    @Arg("productId") productId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const product = await Product.findOne(productId);
    if (!product) return false;

    const userId = req.session.userId;
    const existingCartItem = await CartItem.findOne({
      where: { userId, product },
      relations: ["product"],
    });

    if (!existingCartItem) {
      return false;
    } else if (existingCartItem.quantity >= 2) {
      existingCartItem.quantity--;
      existingCartItem.save();
    } else {
      existingCartItem.remove();
    }

    return true;
  }

  @Query(() => [CartItem])
  @UseMiddleware(isAuth)
  async getCartItems(@Ctx() { req }: MyContext): Promise<CartItem[]> {
    return CartItem.find({
      where: { user: req.session.userId },
      relations: ["product"],
    });
  }
}
