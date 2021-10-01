import Cart from "../entity/Cart";
import CartItem from "../entity/CartItem";
import Product from "../entity/Product";

type CartData = {
  cart: Cart;
  product?: Product;
  cartItem?: CartItem;
};

export const getCartData = async (
  productId?: number,
  userId?: number
): Promise<CartData> => {
  const product = await Product.findOne(productId);
  const cart = await Cart.findOne({ where: { userId } }) || new Cart();

  const cartItem = product
    ? cart.cartItems.find((cartItem) => cartItem.product.id === productId)
    : undefined;

  return { cartItem, cart, product };
};
