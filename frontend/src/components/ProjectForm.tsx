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

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"] as const;

export default function ProjectForm({ existing, onClose }: Props) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("IN_PROGRESS");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [clientName, setClientName] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (existing) {
      setName(existing.name || "");
      setStatus(existing.status || "IN_PROGRESS");
      setDescription(existing.description || "");
      setDeadline(existing.deadline?.slice(0, 10) || "");
      setPriority(existing.priority || "MEDIUM");
      setClientName(existing.clientName || "");
    } else {
      setName("");
      setStatus("IN_PROGRESS");
      setDescription("");
      setDeadline("");
      setPriority("MEDIUM");
      setClientName("");
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

      const payload = {
        name,
        status,
        description,
        deadline,
        priority,
        clientName,
      };

      if (existing) {
        await updateProject(existing.id, payload);
      } else {
        await createProject(payload);
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
          className="w-full max-w-lg"
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
                    onChange={(e) => setName(e.target.value)}
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
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2 text-sm"
                    placeholder="Enter project description"
                    disabled={mutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Deadline
                  </label>
                  <Input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    disabled={mutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-input rounded-md px-3 py-2 text-sm"
                    disabled={mutation.isPending}
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0) + option.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Client Name
                  </label>
                  <Input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Client Co."
                    disabled={mutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-input rounded-md px-3 py-2 text-sm"
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
