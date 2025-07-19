import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import TaskForm from "./TaskForm";
import toast from "react-hot-toast";
import axios from "axios"
type Props = {
  projectId: string;
};

export default function TaskList({ projectId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => (await axios.get(`/tasks/project/${projectId}`)).data,
  });

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => axios.delete(`/tasks/${id}`),
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div className="mt-4">
      {showForm && (
        <TaskForm
          onClose={() => {
            setEditing(null);
            setShowForm(false);
          }}
          existing={editing}
          projectId={projectId}
        />
      )}
      <button
        onClick={() => setShowForm(true)}
        className="my-2 bg-indigo-600 text-white px-3 py-1 rounded"
      >
        + Add Task
      </button>

      <div className="space-y-2">
        {data?.map((t: any) => (
          <div key={t.id} className="bg-white border p-2 rounded">
            <div className="flex justify-between">
              <span>{t.title} - {t.status}</span>
              <div>
                <button
                  onClick={() => {
                    setEditing(t);
                    setShowForm(true);
                  }}
                  className="text-blue-500 text-sm mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(t.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
