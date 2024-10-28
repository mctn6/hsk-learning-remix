import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">HSK Learning Platform</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/words"
          className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-400"
        >
          <h2 className="text-xl font-semibold">Word List</h2>
          <p className="mt-2 text-gray-500">Browse all HSK vocabulary words</p>
        </Link>
        <Link 
          to="/flashcards"
          className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-400"
        >
          <h2 className="text-xl font-semibold">Flashcards</h2>
          <p className="mt-2 text-gray-500">Practice with interactive flashcards</p>
        </Link>
      </div>
    </div>
  );
}