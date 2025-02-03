# GraphQL

## setup

npm install @apollo/server graphql express body-parser cors

## Basics

### 1. Schema Definition (Blueprint of your data)

```javascript
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
}
```

### Queries

Client-side Query

```javascript
query {
  getUser(id: "123") {
    name
    email
  }
}
```

Server Response

```javascript
{
  "data": {
    "getUser": {
      "name": "Rahul",
      "email": "rahul@example.com"
    }
  }
}
```

### Mutations (Data modify )

Client Request

```javascript
mutation {
  createUser(name: "Priya", email: "priya@test.com") {
    id
    name
  }
}
```

Server Response

```javascript
{
  "data": {
    "createUser": {
      "id": "456",
      "name": "Priya"
    }
  }
}
```

### GraphQL vs REST Example

Scenario: User ka name aur email chahiye.

    REST:

        Endpoint: GET /users/123

        Response: Full user data (id, name, email, age, address...) jo server ne bheja.

    GraphQL:

        Query bhejo: getUser(id: "123") { name, email }

        Response: Sirf name aur email aayega.
