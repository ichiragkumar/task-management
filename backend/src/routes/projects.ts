import { Router } from "express";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/users/projects";

import {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getAllTasksByProjectId,
} from "../services/users/tasks";
import { authenticate, authorize } from "../middlewares/auth";
import { Role } from "../generated/prisma";

const projectRouter = Router();

projectRouter.get("/", authenticate, authorize([Role.USER]), getAllProjects);
projectRouter.post("/", authenticate, authorize([Role.USER]), createProject);
projectRouter.patch("/:id", authenticate, authorize([Role.USER]), updateProject);
projectRouter.delete("/:id", authenticate, authorize([Role.USER]), deleteProject);


projectRouter.get("/projectId/:id/tasks", authenticate, authorize([Role.USER]), getAllTasksByProjectId);
projectRouter.post("/:id/tasks", authenticate, authorize([Role.USER]), createTask);
projectRouter.put("/:id/tasks/:taskId", authenticate, authorize([Role.USER]), updateTask);
projectRouter.delete("/:id/tasks/:taskId", authenticate, authorize([Role.USER]), deleteTask);



projectRouter.get("/tasks", authenticate, authorize([Role.USER]), getAllTasks);

export default projectRouter;
