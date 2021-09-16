import "reflect-metadata";
import { createConnection } from "typeorm";

createConnection()
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => console.log(error));
