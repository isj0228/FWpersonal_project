import { Router } from "express";
import authMiddleware from "../middleware/auth";

const router = Router();

router.get("/profile", authMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Profile loaded successfully",
        user: req.user
    });
});

export default router;