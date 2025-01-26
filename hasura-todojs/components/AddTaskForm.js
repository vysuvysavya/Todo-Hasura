import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import toast from "react-hot-toast";

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

export default function AddTaskForm({ refetchTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const [addTask] = useMutation(ADD_TASK, {
    onCompleted: () => {
      toast.success("Task added successfully!");
      refetchTasks(); // Refetch tasks to get the latest task list
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    try {
      await addTask({
        variables: {
          title,
          description: description || "",
          is_completed: isCompleted,
        },
      });

      setTitle("");
      setDescription("");
      setIsCompleted(false);
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Error adding task!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Add New Task</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Task Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
          placeholder="Optional"
        />
      </div>
      <div className="flex items-center">
        <input
          id="is_completed"
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
          className="mr-2 h-4 w-4 text-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="is_completed" className="text-sm text-gray-700">Completed?</label>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
