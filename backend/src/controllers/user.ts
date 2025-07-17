
import express from "express";


import { updateProject } from "../services/users/updateProject";
import { getAllProjects } from "../services/users/getAllProjects";
import { createProject } from "../services/users/createProject";
import { deleteProject } from "../services/users/deleteProject";

const userRouter = express.Router();



userRouter.get("/", getAllProjects);
userRouter.post("/projects", createProject);
userRouter.post("/projects/:id", updateProject);
userRouter.post("/projects:id/delete", deleteProject);

userRouter.get("/projectId/:id/tasks", getAllTasksByProjectId);
userRouter.post("/projects/:id/tasks",createTask);
userRouter.post("/projects/:id:/tasks", updateTask);
userRouter.post("/projects/:id/tasks", deleteTask);


userRouter.get("/tasks", getAllTasks);

// TODO:
// userRouter.post("/:username", deleteAccount);

export default userRouter;

