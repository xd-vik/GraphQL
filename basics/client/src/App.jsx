import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useQuery, gql } from "@apollo/client";

const query = gql`
  query getTodosWithUser {
    getTodos {
      id
      title
      completed
      user {
        id
        name
      }
    }
  }
`;

function App() {
  const { data, loading } = useQuery(query);

  if (loading) return <h1>Data is loading !!</h1>;

  return (
    <>
      <div className="App">
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Task</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody>
            {data.getTodos.map((todo) => (
              <tr>
                <td>{todo.id}</td>
                <td>{todo.user.name}</td>
                <td>{todo.title}</td>
                <td>
                  {todo.completed ? <p> completed </p> : <p>Not Completed </p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
