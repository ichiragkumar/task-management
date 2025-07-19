import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";
import redisClient from "../../../redis/redisClient";
import { CACHE_KEY_TASKS } from "../../../config/types";

export const getAllTasksByProjectId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // add zod validation

    const tasks = await prisma.task.findUnique({
      where: {
        id,
      },
    });
    await redisClient.setEx(CACHE_KEY_TASKS, 60, JSON.stringify(tasks));
    res.status(200).json({
      msg: "success: All tasks",
      tasks,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error: getAllTasksByProjectId" });
  }
};
