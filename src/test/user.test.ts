import { Connection } from "typeorm";
import { graphqlCall } from "./utils/graphqlCall";
import { testConnection } from "./utils/testConnection";

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
      name
    }
  }
}
`;

describe("User", () => {
  it("create user", async () => {
    console.log(
      await graphqlCall({
        source: registerMutation,
        variableValues: {
          options: {
            name: "name",
            email: "email",
            password: "pass",
          },
        },
      })
    );
  });
});
