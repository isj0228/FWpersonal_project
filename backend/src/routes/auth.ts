import { Router } from 'express';
import prisma from "../db";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
const router = Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("BODY:", req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required field(s)."});
  }
  const existingEmail = await prisma.user.findUnique({
    where: { email }
  });

  if (existingEmail) {
    return res.status(400).json({ error: "Email already registered."})
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username }
  });

  if (existingUsername) {
    return res.status(400).json({ error: "Username already registered."})
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash
    }
  });
  return res.status(201).json({
    message: "User created successfully", 
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    }
  });
})

router.post("/login", async (req, res)=> {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required field(s)" });
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id : user.id,
      username: user.username,
      email: user.email
    }
  });
})

export default router;