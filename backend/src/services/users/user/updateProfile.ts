import { Response } from "express";
import prisma from "../../../config/prismaClient";
import { AuthRequest } from "../../../middlewares/auth";

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { email, status, canCreateTasks } = req.body;
  const userId = req.user?.id;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        status,
        canCreateTasks,
      },
    });

    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error: updateProfile" });
  }
};
