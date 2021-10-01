import Cart from "../entity/Cart";
import CartItem from "../entity/CartItem";
import Product from "../entity/Product";

type CartData = {
  cart?: Cart;
  product?: Product;
  cartItem?: CartItem;
  cartItems?: CartItem[];
};

export const getCartData = async (
  productId?: number,
  userId?: number
): Promise<CartData | null> => {
  const product = await Product.findOne(productId);
  const cart = await Cart.findOne({ where: { userId }, relations: ["cartItems"] });
  const cartItem = await CartItem.findOne({
    where: { cart, product },
    relations: ["product"],
  });
  const cartItems = await CartItem.find({
    where: { cart },
    relations: ["product"],
  });

  return { cartItem, cartItems, cart, product };
};
