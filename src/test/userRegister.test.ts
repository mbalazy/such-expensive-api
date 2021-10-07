import { Connection } from "typeorm";
import { graphqlCall } from "./utils/graphqlCall";
import { testConnection } from "./utils/testConnection";
import faker from "faker";
import User from "../entity/User";

let conn: Connection;

beforeAll(async () => {
  conn = await testConnection();
});

afterAll(async () => {
  await conn.close();
});

const registerMutation = `
  mutation Register($options: RegisterInput!) {
    register(options: $options) {
      errors {
        field
        message
      }
      user {
        id
        email
        name
      }
    }
  }
`;

describe("User", () => {
  it("register user", async () => {
    const userData = {
      name: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    };

    const response = await graphqlCall({
      source: registerMutation,
      variableValues: {
        options: userData,
      },
    });

    const dbUser = await User.findOneOrFail({ where: { email: userData.email } });
    expect(dbUser).toBeDefined()
    expect(dbUser.name).toBe(userData.name)
    expect(dbUser.email).toBe(userData.email)

    expect(response).toMatchObject({
      data: {
        register: {
          user: { name: userData.name, email: userData.email },
        },
      },
    });
  });
});
