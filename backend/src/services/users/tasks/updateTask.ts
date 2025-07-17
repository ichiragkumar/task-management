import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";
import { emitProjectTaskEvent } from "../../../kafka/producer";
import { CACHE_KEY, KAFKA_PROJECT_TASKS_EVENTS } from "../../../config/types";
import redisClient from "../../../redis/redisClient";

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id, taskId } = req.params;

    // add zod validation

    const ProjectIdExists = await prisma.project.findUnique({
      where: {
        id: id,
      },
    });
    if (ProjectIdExists) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: req.body,
    });
    await redisClient.del(CACHE_KEY);
    await emitProjectTaskEvent(KAFKA_PROJECT_TASKS_EVENTS.UPDATED, task);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: updateTask" });
  }
};
