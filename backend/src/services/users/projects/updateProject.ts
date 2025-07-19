import prisma from "../../../config/prismaClient";
import { CACHE_KEY, KAFKA_PROJECT_EVENTS } from "../../../config/types";
import { emitProjectEvent } from "../../../kafka/producer";
import redisClient from "../../../redis/redisClient";
import { Request, Response } from "express";

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // add zod validation
    const updatedProject = await prisma.project.update({
      where: { id },
      data: req.body,
    });
    await redisClient.del(CACHE_KEY);
    await emitProjectEvent(KAFKA_PROJECT_EVENTS.UPDATED, updatedProject);
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: updateProject" });
  }
};
