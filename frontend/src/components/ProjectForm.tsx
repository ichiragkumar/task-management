import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { createProject, updateProject } from "../api/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, X } from "lucide-react";

type Props = {
  existing?: any;
  onClose: () => void;
};

export default function ProjectForm({ existing, onClose }: Props) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("IN_PROGRESS");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Initialize form with existing data
  useEffect(() => {
    if (existing) {
      setName(existing.name || "");
      setStatus(existing.status || "IN_PROGRESS");
    } else {
      setName("");
      setStatus("IN_PROGRESS");
    }
    setErrors({});
  }, [existing]);

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
      toast({
        title: "Success",
        description: existing
          ? "Project updated successfully!"
          : "Project created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
    onError: (err: any) => {
      if (err.message !== "Validation failed") {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center space-x-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">
                  {existing ? "Edit Project" : "Create New Project"}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-6 w-6"
                disabled={mutation.isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Project Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) {
                        setErrors({ ...errors, name: undefined });
                      }
                    }}
                    placeholder="e.g. Dashboard Redesign"
                    className={errors.name ? "border-destructive" : ""}
                    disabled={mutation.isPending}
                    autoFocus
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={mutation.isPending}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
