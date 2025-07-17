
import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";
import redisClient from "../../../redis/redisClient";
import { CACHE_KEY, KAFKA_PROJECT_EVENTS, PROJECT_STATUS } from "../../../config/types";
import { emitProjectEvent } from "../../../kafka/producer";   



// soft delete
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

        // add zod validation


        
    const deletedProject = await prisma.project.update({
      where: { id },
      data: { status: PROJECT_STATUS.INACTIVE },
    });
    await redisClient.del(CACHE_KEY);
    await emitProjectEvent(KAFKA_PROJECT_EVENTS.DELETED, deletedProject);
    res.status(200).json(deletedProject);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: deleteProject" });
  }
};