import { Connection } from "typeorm";
import { graphqlCall } from "../utils/graphqlCall";
import { testConnection } from "../utils/testConnection";
import faker from "faker";
import User from "../../entity/User";
import { loginQuery, meQuery, registerMutation } from "./gql";

let dbConnection: Connection;

beforeAll(async () => {
  dbConnection = await testConnection();
});

afterAll(async () => {
  await dbConnection.close();
});

const fakeUser = () => ({
  name: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
});

describe("User", () => {
  it("register user", async () => {
    const userData = fakeUser();

    const response = await graphqlCall({
      source: registerMutation,
      variableValues: {
        options: userData,
      },
    });

    const dbUser = await User.findOneOrFail({
      where: { email: userData.email },
    });
    expect(dbUser).toBeDefined();
    expect(dbUser.name).toBe(userData.name);
    expect(dbUser.email).toBe(userData.email);

    expect(response).toMatchObject({
      data: {
        register: {
          user: { name: userData.name, email: userData.email },
        },
      },
    });
  });

  it("login user", async () => {
    const userData = fakeUser();

    //first register new one
    await graphqlCall({
      source: registerMutation,
      variableValues: {
        options: userData,
      },
    });

    const response = await graphqlCall({
      source: loginQuery,
      variableValues: {
        options: { email: userData.email, password: userData.password },
      },
    });

    expect(response).toMatchObject({
      data: {
        login: {
          user: {
            name: userData.name,
            email: userData.email,
          },
        },
      },
    });
  });

  it("finds me", async () => {
    const userData = fakeUser();

    const user = await User.create(userData).save();

    const response = await graphqlCall({
      source: meQuery,
      userId: user.id,
    });

    expect(response).toMatchObject({
      data: {
        me: {
          name: user.name,
          email: user.email,
        },
      },
    });
  });
});
