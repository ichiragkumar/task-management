import { Response } from "express";
import { USER_KEY } from "../../../config/types";
import prisma from "../../../config/prismaClient";
import redisClient from "../../../redis/redisClient";
import { AuthRequest } from "../../../middlewares/auth";

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
      select: {
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await redisClient.setEx(USER_KEY, 60, JSON.stringify(user));

    res.status(200).json({
      msg: "success: My profile",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error: getMyProfile" });
  }
};
