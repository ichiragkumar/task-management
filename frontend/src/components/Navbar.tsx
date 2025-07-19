import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Menu, X, UserCircle2, LogOut, Trash2, CheckSquare } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
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
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-foreground">
          <CheckSquare className="h-6 w-6 text-primary" />
          <span>Taskify</span>
        </Link>

        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex space-x-6">
                <Link 
                  to="/" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/projects" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Projects
                </Link>
                <Link 
                  to="/overview" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Overview
                </Link>
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDropdown(!dropdown)}
                  className="relative"
                >
                  <UserCircle2 className="h-5 w-5" />
                </Button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg z-50"
                    >
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                          onClick={() => setDropdown(false)}
                        >
                          <UserCircle2 className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </button>
                        <button
                          onClick={deleteAccount}
                          className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent text-destructive transition-colors"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-background"
          >
            <div className="px-4 py-2 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/projects"
                className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                Projects
              </Link>
              <Link
                to="/overview"
                className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                Overview
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
