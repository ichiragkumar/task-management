import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Taskify
        </Link>
        <div className="space-x-4 hidden sm:block">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/projects" className="hover:underline">
            Projects
          </Link>
          <Link to="/tasks" className="hover:underline">
            Tasks
          </Link>
        </div>
      </div>
    </nav>
  );
}
