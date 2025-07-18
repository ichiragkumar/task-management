import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../../config/prismaClient";

export const createAccount = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role : role,
      },
    });

    res.status(201).json({ message: "Account created", user });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error: createAccount" });
  }
};
