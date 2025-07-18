

import { Request, Response } from "express";
import { CACHE_KEY } from "../../../config/types";
import prisma from "../../../config/prismaClient";
import redisClient from "../../../redis/redisClient";


export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany();
    await redisClient.setEx(CACHE_KEY, 60, JSON.stringify(tasks));
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