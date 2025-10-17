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
    const rows = await db.queryAll<{
      id: number;
      role: string;
      content: string;
      refs: Array<{ title: string; source: string; url?: string }> | null;
      createdAt: Date;
    }>`
      SELECT id, role, content, refs, created_at as "createdAt"
      FROM care_buddy_messages
      WHERE conversation_id = ${req.conversationId}
      ORDER BY created_at ASC
    `;
    
    const messages: Message[] = rows.map(r => ({
      id: r.id,
      role: r.role,
      content: r.content,
      createdAt: r.createdAt,
      references: r.refs ?? undefined,
    }));
    
    return { conversationId: req.conversationId, messages };
  }
);
