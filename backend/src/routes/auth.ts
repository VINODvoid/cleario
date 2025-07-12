import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const UserRouter = Router();

// Register
UserRouter.post("/register", (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const existingUser = (email)
  } catch (error) {}
});
