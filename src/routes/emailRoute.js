import express from "express";
import { generateEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/generate-email", generateEmail);

export default router;
