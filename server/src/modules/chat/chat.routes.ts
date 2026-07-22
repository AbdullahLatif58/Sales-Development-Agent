import { Router } from "express";
import { sendMessage } from "./chat.controllers.js";

const router = Router()


router.post("/ask", sendMessage);

export default router;