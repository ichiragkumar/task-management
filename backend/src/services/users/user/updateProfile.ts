import { Response } from "express";
import prisma from "../../../config/prismaClient";
import { AuthRequest } from "../../../middlewares/auth";

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { email, name, status } = req.body;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "User Id is required" });

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        status
      },
    });

    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    console.log("Error in updateProfile:", err);
    res.status(500).json({ error: "Internal Server Error: updateProfile" });
  }
};
