import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface StartConversationRequest {
  childId?: number;
}

interface Conversation {
  id: number;
  userId: string;
  childId?: number;
  userRole: string;
  createdAt: Date;
}

export const startConversation = api<StartConversationRequest, Conversation>(
  { expose: true, method: "POST", path: "/carebuddy/conversation/start", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const conversation = await db.queryRow<Conversation>`
      INSERT INTO care_buddy_conversations (user_id, child_id, user_role)
      VALUES (${auth.userID}, ${req.childId || null}, ${auth.role})
      RETURNING id, user_id as "userId", child_id as "childId", 
                user_role as "userRole", created_at as "createdAt"
    `;
    
    if (!conversation) {
      throw new Error("Failed to start conversation");
    }
    
    return conversation;
  }
);
