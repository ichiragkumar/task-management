import { Router } from "express";

const adminRouter = Router();


adminRouter.get("/dashboard", (_req, res) => {
  res.json({ message: "Admin dashboard route placeholder" });
});

export default adminRouter;
