"use client";
import "./globals.css";
import TaskList from "@/components/TaskList";
import AddTaskForm from "@/components/AddTaskForm";
import { useState } from "react";

export default function Home() {
  const [filter, setFilter] = useState("all");
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <AddTaskForm />
      <TaskList filter={filter} />
    </main>
  );
}
