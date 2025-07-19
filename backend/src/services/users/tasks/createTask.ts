import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";
import { emitProjectTaskEvent } from "../../../kafka/producer";
import {
  CACHE_KEY_TASKS,
  KAFKA_PROJECT_TASKS_EVENTS,
} from "../../../config/types";
import redisClient from "../../../redis/redisClient";
export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const { name, status } = req.body;

    console.log("i am here", projectId);
    if (!projectId) {
      res.status(400).json({ error: "Project id is required" });
      return;
    }

    console.log("name and status", name, status);

    const ProjectIdExists = await prisma.project.findUnique({
      where: { id:projectId },
    });
    console.log("ProjectIdExists", ProjectIdExists);

    if (!ProjectIdExists) {
      res.status(404).json({ error: "Project not found" });
      return;
    }


    const task = await prisma.task.create({
      data: {
        name,
        status,
        projectId: projectId,
      },
    });

    await redisClient.del(CACHE_KEY_TASKS);
    await emitProjectTaskEvent(KAFKA_PROJECT_TASKS_EVENTS.CREATED, task);
    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error: createTask" });
  }
};
