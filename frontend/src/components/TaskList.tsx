import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Pencil,
  Trash2,
  Plus,
  CheckSquare,
  Clock,
  AlertCircle,
  PlayCircle,
  Archive,
  Save,
  X,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getTasksByProjectId,
  createTask,
  updateTask,
  deleteTask,
} from "../api/api";

export default function TaskList({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingTask, setEditingTask] = useState<any>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("PENDING");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["projects", projectId, "tasks"], // More specific key for tasks
    queryFn: () => getTasksByProjectId(projectId),
    enabled: !!projectId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!newTaskName.trim()) {
        throw new Error("Task name is required");
      }
      return createTask(projectId, {
        name: newTaskName,
        status: newTaskStatus,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task added successfully",
      });
      setNewTaskName("");
      setNewTaskStatus("PENDING");
      setShowAddForm(false);
      // Invalidate specific project's tasks
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "tasks"],
      });
      // Consider if you need to invalidate a broader "projects" key here.
      // If "projects" query includes tasks count for all projects, then yes.
      // Otherwise, it might be unnecessary.
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) =>
      toast({
        title: "Error",
        description: error.message || "Error adding task",
        variant: "destructive",
      }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      name,
      status,
    }: {
      id: string;
      name?: string;
      status?: string;
    }) => updateTask(projectId, id, { name, status }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      setEditingTask(null);
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "tasks"],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(projectId, id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "tasks"],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
        return <CheckSquare className="h-4 w-4 text-green-600" />;
      case "IN_PROGRESS":
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "ACTIVE":
        return <AlertCircle className="h-4 w-4 text-green-600" />; // Assuming ACTIVE is similar to IN_PROGRESS or COMPLETED
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

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateMutation.mutate({ id: taskId, status: newStatus });
  };

  const handleDeleteTask = (taskId: string, taskName: string) => {
    if (confirm(`Are you sure you want to delete "${taskName}"?`)) {
      deleteMutation.mutate(taskId);
    }
  };

  const filteredTasks = tasks.filter(
    (task: any) => statusFilter === "all" || task.status === statusFilter
  );

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t: any) => t.status === "COMPLETED").length,
    inProgress: tasks.filter((t: any) => t.status === "IN_PROGRESS").length,
    pending: tasks.filter((t: any) => t.status === "PENDING").length,
  };

  // Only show loading state for the *entire* component if tasks are being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Task Statistics */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-accent/50 rounded-lg p-2">
          <div className="text-lg font-bold text-primary">
            {taskStats.total}
          </div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <div className="text-lg font-bold text-green-600">
            {taskStats.completed}
          </div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-2">
          <div className="text-lg font-bold text-blue-600">
            {taskStats.inProgress}
          </div>
          <div className="text-xs text-muted-foreground">In Progress</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-2">
          <div className="text-lg font-bold text-yellow-600">
            {taskStats.pending}
          </div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
      </div>

      {/* Add Task Section */}
      <div className="space-y-3">
        {!showAddForm ? (
          <Button
            onClick={() => setShowAddForm(true)}
            variant="outline"
            className="w-full hover:bg-accent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Task
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Add New Task</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <Input
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Task name"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newTaskName.trim()) {
                    createMutation.mutate();
                  }
                }}
              />
              <select
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <div className="flex gap-2">
                <Button
                  onClick={() => createMutation.mutate()}
                  disabled={!newTaskName.trim() || createMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending ? "Adding..." : "Add Task"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="ACTIVE">Active</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Task List (or No Tasks Message) */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {tasks.length === 0
                ? "No tasks yet. Use the 'Add New Task' button above to create one."
                : "No tasks match the current filter."}
            </p>
          </div>
        ) : (
          filteredTasks.map((task: any, index: number) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border rounded-lg p-4 hover:shadow-sm transition-all duration-200 hover:bg-accent/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
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
                        <span className="font-medium">{task.name}</span>
                        <div className="flex items-center mt-1 space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status.replace("_", " ").toLowerCase()}
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
                          })
                        }
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? (
                          "Saving..."
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTask(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTask(task)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id, task.name)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}