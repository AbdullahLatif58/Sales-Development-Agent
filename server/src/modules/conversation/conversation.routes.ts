import { Router } from "express";
import {
    getAllConversations,
    getConversationById,
    updateConversation,
    deleteConversation,
    updateConversationTitle,
} from "./conversation.controller.js";

const router = Router();

router.get("/", getAllConversations);

router.get("/:id", getConversationById);

router.patch("/:id", updateConversation);
 
router.patch("/:id/title", updateConversationTitle);

router.delete("/:id", deleteConversation);

export default router;