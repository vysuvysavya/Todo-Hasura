"use client";
import "./globals.css";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <TaskList />
    </main>
  );
}
