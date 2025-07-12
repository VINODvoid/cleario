import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {email, z} from "zod"
import { prisma } from "../lib/db";



const UserRouter = Router();

// validation schemas 
const registerSchema = z.object({
  email:z.email(),
  password:z.string().min(8),
  firstName:z.string().min(3),
  lastName:z.string().min(1),
});

const loginSchema = z.object({
  email:z.email(),
  password:z.string(),
});


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
