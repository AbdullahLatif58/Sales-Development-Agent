import { pool } from "../../config/db.js";


export class ConversationRepository {
    async create(user_id: string){
      const id = crypto.randomUUID();
     const results = await pool.query("INSERT INTO conversations (id, user_id) VALUES ($1, $2) RETURNING *", [id, user_id]);

      return results.rows[0];
    }

    async getAllByUserId(userId: string) {
    const results = await pool.query(
        `
        SELECT *
        FROM conversations
        WHERE user_id = $1
        ORDER BY updated_at DESC
        `,
        [userId]
    );

    return results.rows;
}

   async getByUserId(user_id: string) {
    const results = await pool.query("SELECT * FROM conversations WHERE user_id = $1",[user_id]);
    return results.rows[0];
   }

    async getById(id: string){
     const results =  await pool.query("SELECT * FROM conversations WHERE id = $1 ",[id]);
     return results.rows[0] ?? null;
    }

   async update(id: string, title: string){
      const results = await pool.query("UPDATE conversations SET title = $1 WHERE id = $2 RETURNING *", [title, id]);
        return results.rows[0] ?? null;
   }

     async delete(id: string){
      await pool.query("DELETE FROM conversations WHERE id = $1",[id]);
      return  true;
    }
}