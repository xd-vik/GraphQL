const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const { default: axios } = require("axios");

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: `
        type User{
            id:ID!
            name:String!
            username:String!
            email:String!
            website:String
        
        }
        type Todo{
            id: ID!
            title : String!
            completed : Boolean
            user:User
        }
        type Query{
            getTodos:[Todo]
            getUsers:[User]
            getUser(id: ID!): User
        }
    `,
    resolvers: {
      Todo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.id}`
            )
          ).data,
      },
      Query: {
        getTodos: async () =>
          (
            await axios.get(
              "http://jsonplaceholder.typicode.com/todos?_start=0&_limit=10"
            )
          ).data,
        getUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUser: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
      },
    },
  });

  app.use(cors());
  app.use(bodyParser.json());

  await server.start();

  app.use("/gql", expressMiddleware(server));

  app.listen(8000, () => console.log(`server is running on port 8000`));
}

startServer();
