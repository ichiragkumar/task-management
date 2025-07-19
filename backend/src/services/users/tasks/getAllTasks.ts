import { Request, Response } from "express";
import { CACHE_KEY_TASKS } from "../../../config/types";
import prisma from "../../../config/prismaClient";
import redisClient from "../../../redis/redisClient";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const cached = await redisClient.get(CACHE_KEY_TASKS);
    console.log("Cache for tasks:", cached);

    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.status(200).json({
          msg: "success: All tasks (from cache)",
          tasks: parsed,
        });
      }
    }

    const tasks = await prisma.task.findMany();

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found" });
    }

    await redisClient.setEx(CACHE_KEY_TASKS, 60, JSON.stringify(tasks));

    return res.status(200).json({
      msg: "success: All tasks (from DB)",
      tasks,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: getAllTasks" });
  }
};
