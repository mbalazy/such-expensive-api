import User from "../entity/User";
import { Field, InputType, ObjectType } from "type-graphql";
import CartItem from "src/entity/CartItem";

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
export class CartResponse {
  @Field(() => [CartItem], { nullable: true })
  cartItems?: CartItem[];

  @Field()
  total: number;
}
