import { Connection } from "typeorm";
import { testConnection } from "./utils/testConnection";

let conn: Connection;

beforeAll(async () => {
  conn = await testConnection();
});

afterAll(async () => {
  await conn.close();
});

describe('User', () => {
  it('create user', () => {

  })
})
