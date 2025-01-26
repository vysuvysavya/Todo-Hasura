"use client";
import "./globals.css";
import TaskList from "@/components/TaskList";
import AddTaskForm from "@/components/AddTaskForm";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function Home() {
  const [filter, setFilter] = useState("all");
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <Navbar filter={filter} setFilter={setFilter} />
      <AddTaskForm />
      <TaskList filter={filter} />
    </main>
  );
}
