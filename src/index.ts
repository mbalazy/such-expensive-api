import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { UserResolver } from "./resolvers/user";

createConnection()
  .then(async () => {
    console.log("connected to db");
    const schema = await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    });

    const apolloServer = new ApolloServer({ schema });
    const app = express();
    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
      console.log("server started on http://localhost:4000/graphql");
    });
  })
  .catch((error) => console.log("db connection error: ", error));
