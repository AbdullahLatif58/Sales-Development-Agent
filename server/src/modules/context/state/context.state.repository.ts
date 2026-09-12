import type { Pool } from "pg";

import type { ContextState } from "./context.state.js";

export class ContextStateRepository {
  constructor(
    private readonly db: Pool
  ) {}

  async findByConversationId(
    conversationId: string
  ): Promise<ContextState | null> {
    const result = await this.db.query(
      `
      SELECT
        conversation_id,
        last_compacted_sequence,
        summary,
        summary_version,
        created_at,
        updated_at
      FROM conversation_context_state
      WHERE conversation_id = $1
      `,
      [conversationId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      conversationId: row.conversation_id,
      lastCompactedSequence:
        Number(row.last_compacted_sequence),
      summary: row.summary,
      summaryVersion: row.summary_version,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async create(
    conversationId: string
  ): Promise<ContextState> {
    const result = await this.db.query(
      `
      INSERT INTO conversation_context_state (
        conversation_id
      )
      VALUES ($1)
      RETURNING
        conversation_id,
        last_compacted_sequence,
        summary,
        summary_version,
        created_at,
        updated_at
      `,
      [conversationId]
    );

    const row = result.rows[0];

    return {
      conversationId: row.conversation_id,
      lastCompactedSequence:
        Number(row.last_compacted_sequence),
      summary: row.summary,
      summaryVersion: row.summary_version,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async update(
    conversationId: string,
    lastCompactedSequence: number,
    summary: string
  ): Promise<ContextState> {
    const result = await this.db.query(
      `
      UPDATE conversation_context_state
      SET
        last_compacted_sequence = $2,
        summary = $3,
        summary_version = summary_version + 1,
        updated_at = NOW()
      WHERE conversation_id = $1
      RETURNING
        conversation_id,
        last_compacted_sequence,
        summary,
        summary_version,
        created_at,
        updated_at
      `,
      [
        conversationId,
        lastCompactedSequence,
        summary,
      ]
    );

    if (result.rows.length === 0) {
      throw new Error(
        `Context state not found for conversation: ${conversationId}`
      );
    }

    const row = result.rows[0];

    return {
      conversationId: row.conversation_id,
      lastCompactedSequence:
        Number(row.last_compacted_sequence),
      summary: row.summary,
      summaryVersion: row.summary_version,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}