import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import ProjectForm from "../components/ProjectForm";

const ProjectsPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

 const { data: projects = [] } = useQuery({
  queryKey: ["projects"],
  queryFn: async () => {
    const res = await axios.get("/projects");
    const data = res.data;
    return Array.isArray(data) ? data : [];
  },
});


  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => toast.error("Failed to delete project"),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => {
          setEditing(null);
          setIsFormOpen(true);
        }}>
          <Plus className="mr-2" /> New Project
        </Button>
      </div>

      {isFormOpen && (
        <ProjectForm
          existing={editing}
          onClose={() => {
            setIsFormOpen(false);
            setEditing(null);
          }}
        />
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project: any) => (
          <Card key={project.id} className="shadow-md">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <span className="text-sm uppercase bg-gray-200 px-2 py-1 rounded">
                  {project.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(project);
                    setIsFormOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(project.id)}
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

export default ProjectsPage;
