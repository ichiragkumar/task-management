import { Request, Response } from "express";
import redisClient from "../../../redis/redisClient";
import { CACHE_KEY } from "../../../config/types";
import prisma from "../../../config/prismaClient";


export const getAllProjects = async (req: Request, res: Response) => {
  try {

        // add zod validation


        
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
