import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import TaskForm from "../components/TaskForm";
import { getAllTasks, deleteTask } from "../api/api";

const TasksPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: tasks = [] } = useQuery({
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
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
    },
    onError: () => toast.error("Failed to delete task"),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2" /> New Task
        </Button>
      </div>

      {isFormOpen && (
        <TaskForm
          existing={editing}
          projectId={editing?.projectId || ""}
          onClose={() => {
            setEditing(null);
            setIsFormOpen(false);
          }}
        />
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks?.map((task) => (
  <Card
    key={task.id}
    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md transition hover:shadow-lg"
  >
    <CardContent className="p-5">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {task.title}
        </h2>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            task.status === "COMPLETED"
              ? "bg-green-200 text-green-800"
              : task.status === "IN_PROGRESS"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Project: {task.project?.name}
      </p>

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          className="text-blue-600 dark:text-blue-400 border-blue-500"
          onClick={() => {
            setEditing(task);
            setIsFormOpen(true);
          }}
        >
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => deleteMutation.mutate(task)}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </div>
    </CardContent>
  </Card>
))}

      </div>
    </div>
  );
};

export default TasksPage;
