import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Menu, X, UserCircle2, LogOut, Trash2 } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteAccount = () => {
    // Call delete API here
    alert("Delete account not implemented yet");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Taskify
        </Link>

        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex space-x-4">
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

              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="hover:bg-blue-700 p-2 rounded-full"
                >
                  <UserCircle2 size={28} />
                </button>

                {dropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <LogOut className="inline mr-2" size={16} />
                      Logout
                    </button>
                    <button
                      onClick={deleteAccount}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 className="inline mr-2" size={16} />
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
