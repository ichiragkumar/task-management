import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";
import redisClient from "../../../redis/redisClient";
import { CACHE_KEY_TASKS } from "../../../config/types";


export const getAllTasksByProjectId = async (req: Request, res: Response) => {
  try {


    const { projectId } = req.params;


    const cached = await redisClient.get(CACHE_KEY_TASKS);

    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.status(200).json({
          msg: "success (from cache): All tasks",
          tasks: parsed,
        });
      }
    }


    const tasks = await prisma.task.findMany({
      where: { projectId },
    });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found for this project" });
    }

    await redisClient.setEx(CACHE_KEY_TASKS, 60, JSON.stringify(tasks)); 

    return res.status(200).json({
      msg: "success: All tasks",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error: getAllTasksByProjectId",
    });
  }
};
