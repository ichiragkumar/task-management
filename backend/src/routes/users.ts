import { Router } from "express";
import {
  createAccount,
  accessAccount,
  updateProfile,
  deleteAccount,
  getMyProfile,
} from "../services/users/user";
import { authenticate } from "../middlewares/auth";

const accountRouter = Router();

accountRouter.post("/signup", createAccount);
accountRouter.post("/signin", accessAccount);
accountRouter.put("/update-profile", authenticate, updateProfile);
accountRouter.delete("/profile",authenticate, deleteAccount);
accountRouter.get("/me", authenticate, getMyProfile);
export default accountRouter;
