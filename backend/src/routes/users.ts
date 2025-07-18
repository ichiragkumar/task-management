import { Router } from "express";
import {
  createAccount,
  accessAccount,
  updateProfile,
  deleteAccount,
} from "../services/users/user";

const accountRouter = Router();

accountRouter.post("/signup", createAccount);
accountRouter.post("/signin", accessAccount);
accountRouter.put("/profile", updateProfile);
accountRouter.delete("/profile", deleteAccount);

export default accountRouter;
