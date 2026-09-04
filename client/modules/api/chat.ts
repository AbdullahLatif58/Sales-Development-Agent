export interface SendMessageRequest {
  user_id: string;
  conversationId: string;
  message: string;
}

export type StreamEvent =
  | {
      type: "conversation";
      data: {
        conversationId: string;
        title?: string;
      };
    }
  | {
      type: "token";
      data: {
        content: string;
      };
    }
  | {
      type: "done";
      data: {
        conversationId: string;
      };
    }
  | {
      type: "error";
      data: {
        message: string;
      };
    };

export const chatApi = {
  async sendMessage(
    payload: SendMessageRequest,
    onEvent: (event: StreamEvent) => void,
    signal?: AbortSignal
  ) {
    const response = await fetch("http://localhost:4000/api/chat/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    if (!response.body) {
      throw new Error("Response body is not available");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, {
        stream: true,
      });

      const events = buffer.split("\n\n");

      buffer = events.pop() ?? "";

      for (const event of events) {
        if (!event.trim()) continue;

        let eventType = "";
        let eventData = "";

        for (const line of event.split("\n")) {
          if (line.startsWith("event:")) {
            eventType = line.slice(6).trim();
          }

          if (line.startsWith("data:")) {
            eventData = line.slice(5).trim();
          }
        }

        if (!eventType || !eventData) {
          continue;
        }

        const parsedEvent = {
          type: eventType,
          data: JSON.parse(eventData),
        } as StreamEvent;

        onEvent(parsedEvent);
      }
    }
  },
};