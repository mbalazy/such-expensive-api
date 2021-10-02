import User from "../entity/User";
import { Field, InputType, ObjectType } from "type-graphql";
import Product from "../entity/Product";

@InputType()
export class LoginInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
export class RegisterInput extends LoginInput {
  @Field()
  name: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class OrderItemDetail {
  @Field(() => Product)
  product: Product;
  @Field()
  quantity: number;
  @Field(() => String, { nullable: true })
  sellerAdres: User["adress"];
  @Field(() => String, { nullable: true })
  sellerPhone: User["phone"];
}

@ObjectType()
export class OrderResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [OrderItemDetail], { nullable: true })
  orderDetails?: OrderItemDetail[];
}
