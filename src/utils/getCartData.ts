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
  const product = await Product.findOneOrFail(productId);
  const cart = await Cart.findOneOrFail({ where: { userId } });

  const cartItem = cart.cartItems.find(
    (cartItem) => cartItem.product.id === productId
  );

  return { cartItem, cart, product };
};
