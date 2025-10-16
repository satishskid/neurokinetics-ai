import { api, APIError } from "encore.dev/api";
import db from "../db";

interface GetConversationRequest {
  conversationId: number;
}

interface Message {
  id: number;
  role: string;
  content: string;
  createdAt: Date;
}

interface ConversationHistory {
  conversationId: number;
  messages: Message[];
}

// Retrieves conversation history.
export const getConversation = api<GetConversationRequest, ConversationHistory>(
  { expose: true, method: "GET", path: "/copilot/conversation/:conversationId", auth: true },
  async (req) => {
    const messages = await db.queryAll<Message>`
      SELECT id, role, content, created_at as "createdAt"
      FROM copilot_messages
      WHERE conversation_id = ${req.conversationId}
      ORDER BY created_at ASC
    `;
    
    return { conversationId: req.conversationId, messages };
  }
);
