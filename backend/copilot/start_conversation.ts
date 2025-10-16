import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface StartConversationRequest {
  childId?: number;
  userType: "parent" | "physician";
}

interface Conversation {
  id: number;
  userId: string;
  childId?: number;
  userType: string;
  createdAt: Date;
}

// Starts a new conversation with the AI copilot.
export const startConversation = api<StartConversationRequest, Conversation>(
  { expose: true, method: "POST", path: "/copilot/conversation/start", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const conversation = await db.queryRow<Conversation>`
      INSERT INTO copilot_conversations (user_id, child_id, user_type)
      VALUES (${auth.userID}, ${req.childId || null}, ${req.userType})
      RETURNING id, user_id as "userId", child_id as "childId", 
                user_type as "userType", created_at as "createdAt"
    `;
    
    if (!conversation) {
      throw new Error("Failed to start conversation");
    }
    
    return conversation;
  }
);
