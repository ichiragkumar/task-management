import { Request, Response } from "express";
import redisClient from "../../../redis/redisClient";
import { CACHE_KEY, PROJECT_STATUS } from "../../../config/types";
import prisma from "../../../config/prismaClient";

export const getAllProjects = async (req: Request, res: Response) => {
  try {

    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json(parsed);
      }
    }


    const projects = await prisma.project.findMany({
      where: {
        status: {
          not: PROJECT_STATUS.INACTIVE,
        },
      },
      include: {
        tasks: true,
      },
    });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: "No projects found" });
    }

    await redisClient.setEx(CACHE_KEY, 60, JSON.stringify(projects));


    return res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: getAllProjects" });
  }
};
