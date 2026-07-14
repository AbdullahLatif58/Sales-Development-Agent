
import { pool } from "../../config/db.js";

import { AIRole } from "../ai/ai.types.js";


 export class  MessageRepository {
   async create(conversationid: string, role:AIRole, content: string) {
      const id = crypto.randomUUID();
      const results = await pool.query("INSERT INTO conversation_messages (id, conversation_id, role, content, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *", [id, conversationid, role, content]);

      return results.rows;
   }

   async getByConversationId(conversationId: string) {
      const results = await pool.query("SELECT * FROM conversation_messages WHERE conversation_id = $1 ORDER BY created_at ASC", [conversationId]);

      return results.rows;
   }

   async deleteByConversationId(message_id: string) {
     await pool.query("DELETE from conversation_messages WHERE id = $1 ", [message_id]);
     return true;
   }

   async Upadte(message_id: string, content: string) {
      const results = await pool.query("UPDATE conversation_messages SET content = $1 WHERE id = $2", [content, message_id]);
      return  results.rows[0] ?? null;
   }
 }