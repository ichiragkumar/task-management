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
  Pencil,
  Trash2,
  Plus,
  CheckSquare,
  Clock,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import TaskForm from "../components/TaskForm";
import { getAllTasks, deleteTask } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

const TasksPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => {
      const res = await getAllTasks();
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (task: any) => {
      await deleteTask(task.projectId, task.id);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
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
      case 'COMPLETED':
        return <CheckSquare className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground">Manage all your tasks across projects</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </motion.div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <TaskForm
              existing={editing}
              projectId={editing?.projectId || ""}
              onClose={() => {
                setEditing(null);
                setIsFormOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first task</p>
          <Button
            onClick={() => {
              setEditing(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks?.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{task.title || task.name}</CardTitle>
                      <div className="flex items-center mt-1">
                        <FolderOpen className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">
                          {task.project?.name || "No project"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                        {task.status.replace("_", " ").toLowerCase()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(task);
                        setIsFormOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(task)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
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
