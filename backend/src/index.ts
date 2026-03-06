import express from "express";
import cors from "cors";
import authRouter from "./routes/auth"
import prisma from "./db";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", authRouter)

app.get("/", (req,res) => {
  res.send("Hello");
})

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000")
});
