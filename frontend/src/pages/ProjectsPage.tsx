import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Pencil,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Calendar,
} from "lucide-react";
import ProjectForm from "../components/ProjectForm";
import TaskList from "../components/TaskList";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  name: string;
  status: string;
}

const ProjectsPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    null
  );

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
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => toast({
      title: "Error",
      description: "Failed to delete project",
      variant: "destructive",
    }),
  });

  const toggleExpand = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage your projects and tasks</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </motion.div>

      {/* Project form for create or edit */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectForm
              existing={editing}
              onClose={() => {
                setIsFormOpen(false);
                setEditing(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first project</p>
          <Button
            onClick={() => {
              setEditing(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => toggleExpand(project.id)}
                  >
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground capitalize">
                          {project.status.replace('_', ' ').toLowerCase()}
                        </span>
                      </div>
                    </div>
                    {expandedProjectId === project.id ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
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
                      size="sm"
                      onClick={() => deleteMutation.mutate(project.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>

                  {/* Expandable task section */}
                  <AnimatePresence>
                    {expandedProjectId === project.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-4 border-t mt-4"
                      >
                        <TaskList projectId={project.id} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
