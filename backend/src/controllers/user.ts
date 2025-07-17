


import express from "express";

const userRouter = express.Router();



userRouter.get("/", getAllTasks);
userRouter.post("/", createTask);
userRouter.post("/:id", updateTask);
userRouter.post("/:id/delete", deleteTask);

export default userRouter;

