
import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";
import { emitProjectTaskEvent } from "../../../kafka/producer";
import { CACHE_KEY_TASKS, KAFKA_PROJECT_TASKS_EVENTS } from "../../../config/types";
import redisClient from "../../../redis/redisClient";


export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id, taskId } = req.params;

    // add zod validation

    const ProjectIdExists = await prisma.project.findUnique({
      where: {
        id,
      },
    });
    if (ProjectIdExists) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const task = await prisma.task.delete({
      where: { id: taskId },
    });
    await redisClient.del(CACHE_KEY_TASKS);
    await emitProjectTaskEvent(KAFKA_PROJECT_TASKS_EVENTS.INACTIVE, task);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: deleteTask" });
  }
};  