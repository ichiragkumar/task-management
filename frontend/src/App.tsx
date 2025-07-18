import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import Overview from "./components/Overview";
import Navbar from "./components/Navbar";
import ProfileForm from "./components/ProfileForm";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route
              path="/projects/:projectId"
              element={<ProjectDetailsPage />}
            />
            <Route path="/profile" element={<ProfileForm />} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}
