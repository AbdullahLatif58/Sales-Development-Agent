export  interface ContextState {
    conversationId: string;

    lastCompactedSequence: number;

   summary: string | null;

    summaryVersion: number;

    createdAt: Date;

    updatedAt: Date;
}

