import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { createGraphqlServer } from "./graphql";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  app.use(express.json());
  app.get("/", (req, res) => {
    res.json({ message: "Server is live from backend" });
  });

  app.use(
    "/graphql",
    expressMiddleware(
      await createGraphqlServer()
    ) as unknown as express.RequestHandler
  );

  app.listen(3000, () => console.log(`server is running on port 3000`));
}

init();
