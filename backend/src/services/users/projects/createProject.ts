import prisma from "../../../config/prismaClient";
import redisClient from "../../../redis/redisClient";
import { CACHE_KEY, KAFKA_PROJECT_EVENTS, PROJECT_STATUS } from "../../../config/types";
import {  Response } from "express";
import { emitProjectEvent } from "../../../kafka/producer";
import { AuthRequest } from "../../../middlewares/auth";

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
        // add zod validation

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user id" });
    }

        
    const project = await prisma.project.create({
      data: {
        name: req.body.name,
        userId,
        status: PROJECT_STATUS.IN_PROGRESS,
      },
    });
    await redisClient.del(CACHE_KEY);
    await emitProjectEvent(KAFKA_PROJECT_EVENTS.CREATED, project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: createProject" });
  }
};
