import { api, APIError } from "encore.dev/api";
import db from "../db";

interface GetConversationRequest {
  conversationId: number;
}

interface Message {
  id: number;
  role: string;
  content: string;
  references?: Array<{
    title: string;
    source: string;
    url?: string;
  }>;
  createdAt: Date;
}

interface ConversationHistory {
  conversationId: number;
  messages: Message[];
}

// Retrieves conversation history.
export const getConversation = api<GetConversationRequest, ConversationHistory>(
  { expose: true, method: "GET", path: "/carebuddy/conversation/:conversationId", auth: true },
  async (req) => {
    const messages = await db.queryAll<Message>`
      SELECT id, role, content, care_buddy_messages.references, created_at as "createdAt"
      FROM care_buddy_messages
      WHERE conversation_id = ${req.conversationId}
      ORDER BY created_at ASC
    `;
    
    return { conversationId: req.conversationId, messages };
  }
);
