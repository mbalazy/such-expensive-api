import "reflect-metadata";
import express from "express";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { UserResolver } from "./resolvers/user";
import { ProductResolver } from "./resolvers/product";
import cors from "cors";

createConnection()
  .then(async () => {
    console.log("connected to db");
    const schema = await buildSchema({
      resolvers: [UserResolver, ProductResolver],
      validate: false,
    });

    const app = express();
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();
    app.use(cors({ origin: "http://localhost:3000", credentials: true }));

    app.use(
      session({
        store: new RedisStore({ client: redisClient, disableTouch: true }),
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365,
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        },
        secret: process.env.SESSION_STRING as string,
        name: process.env.SESSION_NAME,
        resave: false,
      })
    );

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({
      app,
      cors: false,
    });

    app.listen(4000, () => {
      console.log("server started on http://localhost:4000/graphql");
    });
  })
  .catch((error) => console.log("db connection error: ", error));
