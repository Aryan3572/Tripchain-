// src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// ✅ Register new real users
export const registerUser = async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const { name, email, password } = parsed;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const { password: _, ...safeUser } = user;
    res.status(201).json({ message: "User registered successfully", user: safeUser });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(400).json({ message: err?.errors || err.message });
  }
};

// ✅ Login existing users
export const loginUser = async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { email, password } = parsed;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(400).json({ message: err?.errors || err.message });
  }
};

// ✅ Get profile of the logged-in user
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
