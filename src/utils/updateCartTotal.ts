import Cart from "../entity/Cart";
import CartItem from "../entity/CartItem";

export const updateCartTotal = async (cartItems: CartItem[], cart?: Cart) => {
    if (!cart) return 0

    const total = cartItems.reduce((acc, val) => {
      acc += val.product.price * val.quantity;
      return acc;
    }, 0);

    cart.total = total;
    await cart.save();

    return total
}
