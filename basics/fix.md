## TS ERROS FIXES

```javascript
app.use(
    "/graphql",
    expressMiddleware(gqlServer) as unknown as express.RequestHandler
  );
```

Another way as to self define the types

```javascript
// Explicitly type the middleware as RequestHandler
const graphqlMiddleware: RequestHandler = expressMiddleware(gqlServer);

app.use("/graphql", graphqlMiddleware);
```
