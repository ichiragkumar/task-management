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

projectRouter.get('/', authenticate, authorize([Role.ADMIN, Role.USER]), getAllProjects);
projectRouter.post('/', authenticate, authorize([Role.ADMIN]), createProject);
projectRouter.put('/:id', authenticate, authorize([Role.ADMIN]), updateProject);
projectRouter.delete('/:id', authenticate, authorize([Role.ADMIN]), deleteProject);


projectRouter.get('/:projectId/tasks', authenticate, authorize([Role.ADMIN, Role.USER]), getAllTasksByProjectId);
projectRouter.post('/:projectId/tasks', authenticate, authorize([Role.ADMIN]), createTask);
projectRouter.put('/:projectId/tasks/:taskId', authenticate, authorize([Role.ADMIN]), updateTask);
projectRouter.delete('/:projectId/tasks/:taskId', authenticate, authorize([Role.ADMIN]), deleteTask);


projectRouter.get("/tasks", authenticate, authorize([Role.ADMIN, Role.USER]), getAllTasks);

export default projectRouter;
