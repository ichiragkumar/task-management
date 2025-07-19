
import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";
import { emitProjectTaskEvent } from "../../../kafka/producer";
import { CACHE_KEY_TASKS, KAFKA_PROJECT_TASKS_EVENTS } from "../../../config/types";
import redisClient from "../../../redis/redisClient";
import { TaskStatus } from "../../../generated/prisma";


export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { projectId, taskId } = req.params;


    const ProjectIdExists = await prisma.project.findUnique({
      where: {
        id : projectId,
      },
    });

    console.log("ProjectIdExists", ProjectIdExists);


    if (!ProjectIdExists) {
      res.status(404).json({ error: "Project not found" });
      return;
    }



    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status: TaskStatus.ARCHIVED },
    });
    await redisClient.del(CACHE_KEY_TASKS);
    await emitProjectTaskEvent(KAFKA_PROJECT_TASKS_EVENTS.INACTIVE, task);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: deleteTask" });
  }
};  