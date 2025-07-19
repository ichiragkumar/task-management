import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { createTask, updateTask } from "../api/api";

type Props = {
  projectId: string;
  existing?: any;
  onClose: () => void;
};
export default function TaskForm({ projectId, existing, onClose }: Props) {
  const [title, setTitle] = useState(existing?.title || "");
  const [status, setStatus] = useState(existing?.status || "PENDING");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) {
        setError("Task title is required");
        throw new Error("Validation failed");
      }
      setError(null);

      const data = { title, status };

      if (existing) {
        await updateTask(projectId, existing.id, data);
      } else {
        await createTask(projectId, data);
      }
    },
    onSuccess: () => {
      toast.success("Task saved");
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
      onClose();
    },
    onError: () => toast.error("Failed to save task"),
  });

  return (
    <div className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {existing ? "Edit Task" : "Create New Task"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
          <button onClick={onClose} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
