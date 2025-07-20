import prisma from "../../../config/prismaClient";
import redisClient from "../../../redis/redisClient";
import { CACHE_KEY, KAFKA_PROJECT_EVENTS, PROJECT_STATUS } from "../../../config/types";
import { Response } from "express";
import { emitProjectEvent } from "../../../kafka/producer";
import { AuthRequest } from "../../../middlewares/auth";



export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user id" });
    }

   

    const { name, description, deadline, priority, clientName, status } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        deadline: deadline ? new Date(deadline) : undefined,
        priority,
        clientName,
        status: status || PROJECT_STATUS.IN_PROGRESS,
        userId,
      },
    });

    await redisClient.del(CACHE_KEY);
    await emitProjectEvent(KAFKA_PROJECT_EVENTS.CREATED, project);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: createProject" });
  }
};
