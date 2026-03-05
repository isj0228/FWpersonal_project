import express from "express";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req,res) => {
  res.send("Hello");
})

app.get("/recipes", async (req, res) => {
  const recipes = await prisma.recipe.findMany();
  res.json(recipes);
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000")
});