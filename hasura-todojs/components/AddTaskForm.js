import { useMutation, gql } from "@apollo/client";
import { useState } from "react";

// Corrected mutation query with non-nullable title
const ADD_TASK = gql`
  mutation InsertTodos($title: String!, $description: String, $is_completed: Boolean) {
    insert_todos(objects: { title: $title, description: $description, is_completed: $is_completed }) {
      affected_rows
      returning {
        id
        title
        description
        is_completed
      }
    }
  }
`;

export default function AddTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const [addTask] = useMutation(ADD_TASK);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if title is provided
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    // Check and log the data being sent to the mutation
    console.log("Sending data to mutation:", { title, description, isCompleted });

    try {
      // Execute mutation with required fields
      const { data } = await addTask({
        variables: {
          title,
          description: description || "",  // Ensure description is an empty string if not provided
          is_completed: isCompleted,
        },
      });

      // Log the response
      console.log("Task Added:", data);
      
      // Reset form after successful submission
      setTitle("");
      setDescription("");
      setIsCompleted(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Task Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="is_completed" className="block text-sm font-medium">Completed</label>
        <input
          id="is_completed"
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
          className="mt-1"
        />
      </div>
      <button type="submit" className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md">Add Task</button>
    </form>
  );
}
