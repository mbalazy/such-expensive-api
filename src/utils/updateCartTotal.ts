import Cart from "../entity/Cart";
import CartItem from "../entity/CartItem";

export const updateCartTotal = async (cart?: Cart) => {
    if (!cart) return 0

    const cartItems = await CartItem.find({
      where: { cart },
      relations: ["product"],
    });

    const total = cartItems.reduce((acc, val) => {
      acc += val.product.price * val.quantity;
      return acc;
    }, 0);

    cart.total = total;
    await cart.save();

    return total
}
