import { CartResolver } from "../resolvers/cart";
import { OrderResolver } from "../resolvers/order";
import { ProductResolver } from "../resolvers/product";
import { UserResolver } from "../resolvers/user";
import { buildSchema } from "type-graphql";

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [UserResolver, ProductResolver, CartResolver, OrderResolver],
    validate: false,
  });
};
