import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import {
  Menu,
  X,
  UserCircle2,
  LogOut,
  Trash2,
  CheckSquare,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../hooks/use-toast";
import { deleteAccount } from "../api/api";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
      localStorage.removeItem("token");
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
        >
          <CheckSquare className="h-6 w-6 text-primary" />
          <span>Taskify</span>
        </Link>

        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex space-x-6">
                <Link
                  to="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  to="/projects"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  Projects
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  to="/tasks"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  Tasks
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  to="/overview"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  Overview
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDropdown(!dropdown)}
                  className="relative hover:bg-accent"
                >
                  <UserCircle2 className="h-5 w-5" />
                </Button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg z-50"
                    >
                      <div className="p-2 space-y-1">
                        <Link
                          to="/profile"
                          className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                          onClick={() => setDropdown(false)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Profile Settings
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </button>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {isDeleting ? "Deleting..." : "Delete Account"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-accent"
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                {mobileMenu ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hover:bg-accent">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="hover:bg-primary/90">
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
                to="/tasks"
                className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                Tasks
              </Link>
              <Link
                to="/overview"
                className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                Overview
              </Link>
              <div className="border-t my-1"></div>
              <Link
                to="/profile"
                className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                Profile Settings
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
