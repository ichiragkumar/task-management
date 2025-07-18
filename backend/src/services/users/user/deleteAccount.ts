import {  Response } from "express";
import prisma from "../../../config/prismaClient";
import { AuthRequest } from "../../../middlewares/auth";
import { UserStatus } from "../../../generated/prisma";

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.DELETED },
    });
    res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error: deleteAccount" });
  }
};
