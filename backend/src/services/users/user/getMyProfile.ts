

import {  Response } from "express";
import { CACHE_KEY } from "../../../config/types";
import prisma from "../../../config/prismaClient";
import redisClient from "../../../redis/redisClient";
import { AuthRequest } from "../../../middlewares/auth";


export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
    });
    await redisClient.setEx(CACHE_KEY, 60, JSON.stringify(user));
    res.status(200).json({
      msg: "success: My profile",
      user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal Server Error: getMyProfile" });
  }
};  