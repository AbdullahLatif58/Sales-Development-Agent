import { Request, Response } from "express";
import { ConversationRepository } from "./conversation.repository.js";
import { MessageRepository } from "../messages/messages.repository.js";

const conversationRepository = new ConversationRepository();

const messageRepository = new MessageRepository();

export  async function getAllConversations(req:Request, res: Response) {
    try {
      const userId = req.query;
      if(!userId){
         res.status(400).json({
           success: false,
           message: "userId is required"
         });
      }

      const conversations = await conversationRepository.getAllByUserId(userId as any);
      res.status(200).json({
        success: true,
        data: conversations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
}

 export async function  getConversationById(req:Request, res: Response) {
   try {
       const { id } = req.params;
      if(!id) {
         res.status(400).json({
            success: false,
            message: "id is required"
         })
      }
     const conversation = await conversationRepository.getById(id as any);
      if (!conversation) {

            return res.status(404).json({

                success: false,

                message: "Conversation not found.",

            });

        }
        const message = await messageRepository.getByConversationId(id as any);

        return res.status(200).json({
         success: true,
         data :{
            conversation,
            message
         }
        })

   }catch(error: string | any) {
      return res.status(500).json({
         success: false,

            message: "Internal Server Error",
      })
   }
      }


      export async function updateConversation(

    req: Request,

    res: Response

) {

    try {

        const { id } = req.params;

        const { title } = req.body;

        if (!title || typeof title !== "string") {

            return res.status(400).json({

                success: false,

                message: "title is required.",

            });

        }

        const conversation =

            await conversationRepository.getById(id as any);

        if (!conversation) {

            return res.status(404).json({

                success: false,

                message: "Conversation not found.",

            });

        }

        const updatedConversation =

            await conversationRepository.update(id as any, title);

        return res.status(200).json({

            success: true,

            data: updatedConversation,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

}

export async function deleteConversation(

    req: Request,

    res: Response

) {

    try {

        const { id } = req.params;

        const conversation =

            await conversationRepository.getById(id as any);

        if (!conversation) {

            return res.status(404).json({

                success: false,

                message: "Conversation not found.",

            });

        }

        await messageRepository.deleteByConversationId(id as any);

        await conversationRepository.delete(id as any);

        return res.status(200).json({

            success: true,

            message: "Conversation deleted successfully.",

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

}
 

