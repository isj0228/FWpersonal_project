import { Router } from 'express';
import prisma from "../db";
import bcrypt from "bcrypt";

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

export default router;