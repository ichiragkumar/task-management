import { Request, Response } from "express";
import redisClient from "../redis/redisClient";
import prisma from "../config/prismaClient";
import { CACHE_KEY } from "../config/types";

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const cached = await redisClient.get(CACHE_KEY);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const projects = await prisma.project.findMany();
    await redisClient.setEx(CACHE_KEY, 60, JSON.stringify(projects));

    return res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: getAllProjects" });
  }
};
