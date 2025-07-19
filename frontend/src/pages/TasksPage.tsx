import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  CheckCircle,
  PlayCircle,
  Clock,
  AlertCircle,
  Archive,
  Edit,
  Trash2,
  Plus,
  FolderOpen,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllTasks, updateTask, deleteTask } from "../api/api";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";

interface Task {
  id: string;
  name: string;
  status: string;
  projectId: string;
}

const TasksPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getAllTasks,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      projectId,
      name,
      status,
    }: {
      id: string;
      projectId: string;
      name?: string;
      status?: string;
    }) => updateTask(projectId, id, { name, status }),

    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      setEditingTask(null);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
  mutationFn: ({ id, projectId }: { id: string; projectId: string }) =>
  deleteTask(projectId, id),

    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      }),
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "IN_PROGRESS":
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "ACTIVE":
        return <AlertCircle className="h-4 w-4 text-green-600" />;
      case "ARCHIVED":
        return <Archive className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-50 border-green-200";
      case "IN_PROGRESS":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "ACTIVE":
        return "text-green-600 bg-green-50 border-green-200";
      case "ARCHIVED":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesSearch = task.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Task];
      let bValue = b[sortBy as keyof Task];

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleDeleteTask = (task: Task) => {
  if (confirm(`Are you sure you want to delete "${task.name}"?`)) {
    deleteMutation.mutate({ id: task.id, projectId: task.projectId });
  }
};


  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    active: tasks.filter((t) => t.status === "ACTIVE").length,
    archived: tasks.filter((t) => t.status === "ARCHIVED").length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track all your tasks across projects
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/projects">
            <Button variant="outline" className="hover:bg-accent">
              <FolderOpen className="mr-2 h-4 w-4" />
              View Projects
            </Button>
          </Link>
          <Link to="/projects">
            <Button className="hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Task Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-6 gap-4"
      >
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {taskStats.total}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {taskStats.completed}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {taskStats.inProgress}
            </div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {taskStats.pending}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {taskStats.active}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {taskStats.archived}
            </div>
            <div className="text-xs text-muted-foreground">Archived</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="projectId">Project</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.div>

      {/* Task List */}
      {filteredAndSortedTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center py-12"
        >
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {tasks.length === 0
              ? "No tasks found"
              : "No tasks match your filters"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {tasks.length === 0
              ? "Get started by creating tasks in your projects"
              : "Try adjusting your search or filter criteria"}
          </p>
          {tasks.length === 0 && (
            <Link to="/projects">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        {editingTask?.id === task.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editingTask.name}
                              onChange={(e) =>
                                setEditingTask({
                                  ...editingTask,
                                  name: e.target.value,
                                })
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  updateMutation.mutate({
                                    id: task.id,
                                    name: editingTask.name,
                                    projectId: task.projectId,

                                  });
                                }
                              }}
                            />
                            <select
                              value={editingTask.status}
                              onChange={(e) =>
                                setEditingTask({
                                  ...editingTask,
                                  status: e.target.value,
                                })
                              }
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="ACTIVE">Active</option>
                              <option value="ARCHIVED">Archived</option>
                            </select>
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-medium text-lg">{task.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                                  task.status
                                )}`}
                              >
                                {task.status.replace("_", " ").toLowerCase()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Project: {task.projectId}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {editingTask?.id === task.id ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateMutation.mutate({
                                id: task.id,
                                name: editingTask.name,
                                status: editingTask.status,
                                projectId: task.projectId,

                              })
                            }
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTask(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTask(task)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTask(task)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
