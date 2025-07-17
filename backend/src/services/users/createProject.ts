import prisma from "../../config/prismaClient";
import redisClient from "../../redis/redisClient";
import { CACHE_KEY, KAFKA_PROJECT_EVENTS } from "../../config/types";
import { Request, Response } from "express";
import { emitProjectEvent } from "../../kafka/producer";

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    await redisClient.del(CACHE_KEY);
    await emitProjectEvent(KAFKA_PROJECT_EVENTS.CREATED, project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: createProject" });
  }
};
