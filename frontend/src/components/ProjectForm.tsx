import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createProject, updateProject } from "../api/api";
import { Button } from "../components/ui/button";

type Props = {
  existing?: any;
  onClose: () => void;
};

export default function ProjectForm({ existing, onClose }: Props) {
  const [name, setName] = useState(existing?.name || "");
  const [status, setStatus] = useState(existing?.status || "IN_PROGRESS");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!name.trim()) {
        setErrors({ name: "Project name is required" });
        throw new Error("Validation failed");
      }
      setErrors({});
      if (existing) {
        await updateProject(existing.id, { name, status });
      } else {
        await createProject({ name, status });
      }
    },
    onSuccess: () => {
      toast.success("Project saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
    onError: (err: any) => {
      if (err.message !== "Validation failed") {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <div className="p-6 border rounded-xl shadow bg-white w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {existing ? "Edit Project" : "Create New Project"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dashboard Redesign"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
