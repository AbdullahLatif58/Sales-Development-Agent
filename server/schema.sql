CREATE TABLE conversation_context_state (
    conversation_id UUID PRIMARY KEY,
    last_compacted_sequence BIGINT NOT NULL DEFAULT 0,
    summary TEXT,
    summary_version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
