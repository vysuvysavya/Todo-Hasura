import { useQuery, gql } from "@apollo/client";

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      description
      is_completed
    }
  }
`;

export default function TaskList() {
  const { data, loading, error } = useQuery(GET_TODOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("Fetched data:", data);

  return (
    <ul>
      {data.todos.map((task) => (
        <li key={task.id}>
          <h3>{task.title || "Untitled Task"}</h3>
          <p>{task.description || "No description provided."}</p>
          <p>{task.is_completed ? "Completed" : "Pending"}</p>
        </li>
      ))}
    </ul>
  );
}
