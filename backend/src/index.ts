import express from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";

const app = express();

app.use(express.json());

app.use("/auth", authRouter)
app.use("/user", userRouter);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000")
});
