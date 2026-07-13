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

