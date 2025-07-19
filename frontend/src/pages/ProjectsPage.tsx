import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Pencil, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import ProjectForm from "../components/ProjectForm";
import TaskList from "../components/TaskList";


interface Project {
  id: string;
  name: string;
  status: string;
}

const ProjectsPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  // Fetch all projects
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/projects");
      return Array.isArray(res.data) ? res.data : [];
    },
  });


  const deleteMutation = useMutation({
    mutationFn: async (id: string) => axios.delete(`/projects/${id}`),
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => toast.error("Failed to delete project"),
  });


  const toggleExpand = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2" size={18} />
          New Project
        </Button>
      </div>

      {/* Project form for create or edit */}
      {isFormOpen && (
        <ProjectForm
          existing={editing}
          onClose={() => {
            setIsFormOpen(false);
            setEditing(null);
          }}
        />
      )}

      {/* Loading state */}
      {isLoading ? (
        <p className="text-gray-500 text-center mt-10">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No projects found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="shadow-md">
              <CardContent className="p-4 space-y-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(project.id)}
                >
                  <div>
                    <h2 className="text-xl font-semibold">{project.name}</h2>
                    <p className="text-sm text-gray-500">Status: {project.status}</p>
                  </div>
                  {expandedProjectId === project.id ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(project);
                      setIsFormOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(project.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>

                {/* Expandable task section */}
                {expandedProjectId === project.id && (
                  <div className="pt-4 border-t mt-4">
                    <TaskList projectId={project.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
