import { useQuery, gql, useMutation } from "@apollo/client";
import { CheckCircleIcon, XCircleIcon, Trash2Icon, EditIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import AddTaskForm from "./AddTaskForm"; // Import the AddTaskForm component

const GET_TODOS = gql`
  query GetTodos($limit: Int!, $offset: Int!) {
    todos(limit: $limit, offset: $offset , order_by: {id: desc}) {
      id
      title
      description
      is_completed
    }
    todos_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTodo($id: Int!) {
    delete_todos(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTodo($id: Int!, $title: String!, $description: String, $is_completed: Boolean) {
    update_todos(
      where: { id: { _eq: $id } }
      _set: { title: $title, description: $description, is_completed: $is_completed }
    ) {
      returning {
        id
        title
        description
        is_completed
      }
    }
  }
`;

export default function TaskList() {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data, loading, error, refetch } = useQuery(GET_TODOS, {
    variables: {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    },
  });

  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState(false);

if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
    </div>
  );
}
  if (error) return <p>Error: {error.message}</p>;
  const handleDeleteTask = async (id) => {
    try {
      const { data: mutationData } = await deleteTask({
        variables: { id },
        update: (cache) => {
          const existingTodos = cache.readQuery({
            query: GET_TODOS,
            variables: {
              limit: pageSize,
              offset: (page - 1) * pageSize,
            },
          });
  
          if (!existingTodos || !existingTodos.todos) return; // Safeguard for missing cache
  
          const updatedTodos = existingTodos.todos.filter(todo => todo.id !== id);
          cache.writeQuery({
            query: GET_TODOS,
            data: {
              ...existingTodos,
              todos: updatedTodos,
            },
            variables: {
              limit: pageSize,
              offset: (page - 1) * pageSize,
            },
          });
        },
      });
  
      if (mutationData.delete_todos.affected_rows > 0) {
        toast.success("Task deleted successfully!");
      } else {
        toast.error("Failed to delete task!");
      }
    } catch (error) {
      toast.error("Failed to delete task!");
      console.error(error);
    }
  };
  
  
  const handleUpdateTask = async () => {
    if (!newTitle) {
      toast.error("Task title is required!");
      return;
    }
  
    try {
      const { data: mutationData } = await updateTask({
        variables: {
          id: currentTask.id,
          title: newTitle,
          description: newDescription || "",
          is_completed: newStatus,
        },
        update: (cache, { data: { update_todos } }) => {
          const existingTodos = cache.readQuery({ query: GET_TODOS });
          if (!existingTodos || !existingTodos.todos) return; // Safeguard for missing cache
          const updatedTodos = existingTodos.todos.map(todo =>
            todo.id === currentTask.id ? { ...todo, ...update_todos.returning[0] } : todo
          );
          cache.writeQuery({
            query: GET_TODOS,
            data: { ...existingTodos, todos: updatedTodos },
          });
        },
      });
  
      // Safeguard for undefined or empty response
      if (
        mutationData &&
        mutationData.update_todos &&
        mutationData.update_todos.returning &&
        mutationData.update_todos.returning.length > 0
      ) {
        const updatedTask = mutationData.update_todos.returning[0];
        toast.success(`Task "${updatedTask.title}" updated successfully!`);
      } else {
        toast.error("Failed to update task: No data returned!");
      }
  
      setIsModalOpen(false); // Close the modal after a successful update
    } catch (error) {
      toast.error("Failed to update task!");
      console.error(error);
    }
  };
  

  const openUpdateModal = (task) => {
    setCurrentTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description);
    setNewStatus(task.is_completed);
    setIsModalOpen(true);
  };

  const totalTasks = data?.todos_aggregate?.aggregate?.count || 0;
  const totalPages = Math.ceil(totalTasks / pageSize);

  return (
    <div className="container mx-auto mt-8 px-6">
      <Toaster />

      <AddTaskForm refetchTasks={refetch} /> {/* Pass refetch function to AddTaskForm */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Task List</h1>

      <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border border-gray-200">Title</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border border-gray-200">Description</th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 border border-gray-200">Status</th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 border border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.todos.map((task, index) => (
            <tr
              key={task.id}
              className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50 transition duration-200`}
            >
              <td className="px-6 py-4 text-sm text-gray-800 border border-gray-200">{task.title || "Untitled Task"}</td>
              <td className="px-6 py-4 text-sm text-gray-600 border border-gray-200">{task.description || "No description provided."}</td>
              <td className="px-6 py-4 text-center border border-gray-200">
                {task.is_completed ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-500 inline-block" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-red-500 inline-block" />
                )}
              </td>
              <td className="px-6 py-4 text-center border border-gray-200">
                <button
                  onClick={() => openUpdateModal(task)}
                  className="text-blue-500 hover:text-blue-700 mr-3 transition duration-200"
                >
                  <EditIcon className="w-5 h-5 inline-block" />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                >
                  <Trash2Icon className="w-5 h-5 inline-block" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 mb-6 flex justify-center">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded-l-md text-gray-600"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-100 text-gray-700">{page} / {totalPages}</span>
        <button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-r-md text-gray-600"
        >
          Next
        </button>
      </div>

      {/* Update Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold text-center mb-4">Edit Task</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">Description</label>
              <textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex items-center">
                <label className="mr-2">Completed</label>
                <input
                  type="checkbox"
                  checked={newStatus}
                  onChange={() => setNewStatus(!newStatus)}
                  className="h-4 w-4"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-200 rounded-md mr-4"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                className="px-6 py-2 bg-blue-600 text-white rounded-md"
              >
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
