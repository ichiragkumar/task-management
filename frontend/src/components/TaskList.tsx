import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function TaskList({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
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
      toast.success("Task added");
      setNewTaskName("");
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
    onError: () => toast.error("Error adding task"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) =>
      axios.put(`/projects/${projectId}/tasks/${id}`, { name }),
    onSuccess: () => {
      toast.success("Task updated");
      setEditingTask(null);
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      axios.delete(`/projects/${projectId}/tasks/${id}`),
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <input
          className="border rounded px-2 py-1 w-full"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="New task name"
        />
        <Button onClick={() => createMutation.mutate()}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {tasks.map((task: any) => (
        <div
          key={task.id}
          className="border px-3 py-2 rounded flex justify-between items-center"
        >
          {editingTask?.id === task.id ? (
            <input
              className="border px-2 py-1 mr-2 flex-1"
              value={editingTask.name}
              onChange={(e) =>
                setEditingTask({ ...editingTask, name: e.target.value })
              }
            />
          ) : (
            <span>{task.name}</span>
          )}

          <div className="flex gap-2">
            {editingTask?.id === task.id ? (
              <Button
                variant="outline"
                onClick={() =>
                  updateMutation.mutate({
                    id: task.id,
                    name: editingTask.name,
                  })
                }
              >
                Save
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setEditingTask(task)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(task.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
