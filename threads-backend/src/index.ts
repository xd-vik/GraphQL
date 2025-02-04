import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  app.use(express.json());

  //Create GraphQL Server
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query{
        hello: String
        say(name:String):String
      }
      type Mutation{
        createUser(firstName:String! ,lastName:String! ,email:String! ,password:String!): Boolean
      }
    `,
    resolvers: {
      Query: {
        hello: () => `hello from GraphQL Server`,
        say: (_, { name }: { name: String }) => `Hey ${name} How are you ?`,
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await prismaClient.user.create({
            data: {
              firstName,
              lastName,
              email,
              password,
              salt: "random_salt",
            },
          });
          return true;
        },
      },
    },
  });

  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "Server is live from backend" });
  });

  app.use(
    "/graphql",
    expressMiddleware(gqlServer) as unknown as express.RequestHandler
  );

  app.listen(3000, () => console.log(`server is running on port 3000`));
}

init();
