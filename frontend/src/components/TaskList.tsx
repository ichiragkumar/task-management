import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "./ui/input";
import {
  Pencil,
  Trash2,
  Plus,
  CheckSquare,
  Clock,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskList({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingTask, setEditingTask] = useState<any>(null);
  const [newTaskName, setNewTaskName] = useState("");

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => (await axios.get(`/projects/${projectId}/tasks`)).data,
  });

  const createMutation = useMutation({
    mutationFn: async () =>
      axios.post(`/projects/${projectId}/tasks`, {
        name: newTaskName,
        status: "PENDING",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task added successfully",
      });
      setNewTaskName("");
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
    onError: () => toast({
      title: "Error",
      description: "Error adding task",
      variant: "destructive",
    }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) =>
      axios.put(`/projects/${projectId}/tasks/${id}`, { name }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      setEditingTask(null);
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      axios.delete(`/projects/${projectId}/tasks/${id}`),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
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
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Input
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="New task name"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && newTaskName.trim()) {
              createMutation.mutate();
            }
          }}
        />
        <Button 
          onClick={() => createMutation.mutate()} 
          disabled={!newTaskName.trim() || createMutation.isPending}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          {createMutation.isPending ? "Adding..." : "Add"}
        </Button>
      </div>

      <div className="space-y-2">
        {tasks.map((task: any, index: number) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border rounded-lg p-3 flex justify-between items-center hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center space-x-3 flex-1">
              {getStatusIcon(task.status)}
              {editingTask?.id === task.id ? (
                <Input
                  className="flex-1"
                  value={editingTask.name}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, name: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      updateMutation.mutate({
                        id: task.id,
                        name: editingTask.name,
                      });
                    }
                  }}
                />
              ) : (
                <div className="flex-1">
                  <span className="font-medium">{task.name}</span>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {editingTask?.id === task.id ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateMutation.mutate({
                      id: task.id,
                      name: editingTask.name,
                    })
                  }
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingTask(task)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(task.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No tasks yet. Add your first task above.</p>
        </div>
      )}
    </div>
  );
}
