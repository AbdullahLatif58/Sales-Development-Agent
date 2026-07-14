import  express from "express";

import cors from "cors";
import chatRoutes from "./modules/chat/chat.routes.js"
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/chat", chatRoutes);

export default app;

// 550e8400-e29b-41d4-a716-446655440000