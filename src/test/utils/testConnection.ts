import { createConnection } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

export const testConnection = (drop: boolean = false) => {
  return createConnection({
    type: "postgres",
    host: `${process.env.TYPEORM_HOST}`,
    port: Number(`${process.env.TYPEORM_PORT}`),
    username: `${process.env.TYPEORM_USERNAME}`,
    password: `${process.env.TYPEORM_PASSWORD}`,
    database: `${process.env.TYPEORM_DATABASE}-test`,
    synchronize: drop,
    dropSchema: drop,
    logging: false,
    entities: [__dirname + "/../../entity/*.*"],

    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  });
};
