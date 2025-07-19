import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from 'react-hot-toast';
import ProjectForm from "./ProjectForm";
import TaskList from "./TaskList";

export default function ProjectList() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await axios.get("/projects")).data,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => axios.delete(`/projects/${id}`),
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {showForm && (
        <ProjectForm
          onClose={() => {
            setEditing(null);
            setShowForm(false);
          }}
          existing={editing}
        />
      )}

      <button
        onClick={() => setShowForm(true)}
        className="my-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        + Add Project
      </button>

      {data?.map((p: any) => (
        <div key={p.id} className="border rounded p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p>Status: {p.status}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditing(p);
                  setShowForm(true);
                }}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(p.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>

          <TaskList projectId={p.id} />
        </div>
      ))}
    </div>
  );
}
