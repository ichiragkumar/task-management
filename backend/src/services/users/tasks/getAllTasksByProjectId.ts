import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";
import redisClient from "../../../redis/redisClient";


export const getAllTasksByProjectId = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }


    const cacheKey = `tasks:${projectId}`;


    const cached = await redisClient.get(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      return res.status(200).json({
        msg: "success (from cache): Project-specific tasks",
        tasks: parsed,
      });
    }


    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });


    if (tasks.length > 0) {
      await redisClient.setEx(cacheKey, 60, JSON.stringify(tasks));
    }

    return res.status(200).json({
      msg: "success: Project-specific tasks",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error: getAllTasksByProjectId",
    });
  }
};
