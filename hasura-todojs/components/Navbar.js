"use client";
export default function Navbar({ filter, setFilter }) {
  return (
    <nav>
      <button onClick={() => setFilter("all")}>All</button>
      <button onClick={() => setFilter("completed")}>Completed</button>
      <button onClick={() => setFilter("pending")}>Pending</button>
    </nav>
  );
}
