
import express from "express";

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


const userRouter = express.Router();



userRouter.get("/", getAllProjects);
userRouter.post("/projects", createProject);
userRouter.post("/projects/:id", updateProject);
userRouter.post("/projects:id/delete", deleteProject);

userRouter.get("/projectId/:id/tasks", getAllTasksByProjectId);
userRouter.post("/projects/:id/tasks",createTask);
userRouter.post("/projects/:id/tasks/:taskId", updateTask);
userRouter.post("/projects/:id/tasks", deleteTask);


userRouter.get("/tasks", getAllTasks);

// TODO:
// userRouter.post("/:username", deleteAccount);

export default userRouter;

