import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";

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
      if (existing) {
        await axios.put(`/tasks/${existing.id}`, { title, status });
      } else {
        await axios.post("/tasks", { title, status, projectId });
      }
    },
    onSuccess: () => {
      toast.success("Task saved");
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      onClose();
    },
    onError: () => toast.error("Failed to save task"),
  });

  return (
    <div className="p-6 border rounded-xl shadow bg-white w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {existing ? "Edit Task" : "Create New Task"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
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
          <button onClick={onClose} className="text-sm text-gray-600 hover:underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
