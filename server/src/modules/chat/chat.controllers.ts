import type { Request, Response } from "express";
import { chatService } from "./chat.services.js";
import { OllamaProvider } from "../ai/ollama.provider.js";


  const aiProvider = new chatService(new OllamaProvider());

    export async function sendMessage(req:Request, res:Response) {
      
      try {
           
      const response = await aiProvider.sendMessage(req.body.message);

      return res.status(200).json({
         success: true,
         message: response.message
      })
      }catch(error) {
      console.log("Unable to call LLm", error);
      }
    }