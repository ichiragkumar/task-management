

import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";
import { emitProjectTaskEvent } from "../../../kafka/producer";
import { CACHE_KEY, KAFKA_PROJECT_TASKS_EVENTS } from "../../../config/types";
import redisClient from "../../../redis/redisClient";
export const createTask = async (req: Request, res: Response) => {
    try{
        // add zod validation
        const { id } = req.params;
        

        const ProjectIdExists = await prisma.project.findMany({
            where: {
                id: id
            }
        })
        if(ProjectIdExists.length === 0){
            res.status(404).json({ error: "Project not found" });
            return;
        }
        const task = await prisma.task.create({ data: req.body });
        await redisClient.del(CACHE_KEY);
        await emitProjectTaskEvent(KAFKA_PROJECT_TASKS_EVENTS.CREATED, task);
        res.status(201).json(task);
    }catch(error){
        res.status(500).json({ error: "Internal Server Error: createTask" });
    }
}