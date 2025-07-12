import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/db";

const UserRouter = Router();

// validation schemas
const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().min(3),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

// Register
UserRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const validateData = registerSchema.parse(req.body);
    const { email, password, firstName, lastName } = validateData;

    // check for existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser)
      return res.status(400).json({
        message: "User already exists",
      });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user with profile and default portfolio
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        profile: {
          create: {
            riskTolerance: "MEDIUM",
            investmentGoals: [],
          },
        },
        portfolios: {
          create: {
            name: "Default Portfolio",
            description: "Main investment portfolio",
            isDefault: true,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.message,
      });
    }
    console.log("Registration Error", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Login
UserRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const validateData = loginSchema.parse(req.body);
    const { email, password } = validateData;

    // find user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    });

    if (!user)
      return res.status(400).json({
        message: "Invalid Credentials",
      });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        message: "Invalid Credentials",
      });

    // generate token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profile: user.profile,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.message });
    }
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
