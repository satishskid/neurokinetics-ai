import { api } from "encore.dev/api";
import db from "../db";

interface SendMessageRequest {
  conversationId: number;
  content: string;
}

interface Message {
  id: number;
  role: string;
  content: string;
  createdAt: Date;
}

interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
}

// Sends a message and receives an AI response.
export const sendMessage = api<SendMessageRequest, SendMessageResponse>(
  { expose: true, method: "POST", path: "/copilot/message", auth: true },
  async (req) => {
    // Save user message
    const userMessage = await db.queryRow<Message>`
      INSERT INTO copilot_messages (conversation_id, role, content)
      VALUES (${req.conversationId}, 'user', ${req.content})
      RETURNING id, role, content, created_at as "createdAt"
    `;
    
    if (!userMessage) {
      throw new Error("Failed to save user message");
    }
    
    // Generate AI response (simulated - in production would use actual AI)
    let aiResponse = "Thank you for your question. ";
    
    if (req.content.toLowerCase().includes('progress') || req.content.toLowerCase().includes('improvement')) {
      aiResponse += "It's wonderful that you're tracking your child's progress! Consistent observation and documentation are key to understanding what interventions work best. Would you like me to help you analyze the progress data or suggest next steps?";
    } else if (req.content.toLowerCase().includes('behavior') || req.content.toLowerCase().includes('meltdown')) {
      aiResponse += "Managing challenging behaviors can be difficult. I recommend using a functional behavior assessment approach: observe what happens before the behavior (antecedent), the behavior itself, and what happens after (consequence). This ABC analysis can help identify triggers and develop effective strategies.";
    } else if (req.content.toLowerCase().includes('intervention') || req.content.toLowerCase().includes('therapy')) {
      aiResponse += "Evidence-based interventions like Applied Behavior Analysis (ABA), speech therapy, and occupational therapy have shown significant benefits for children with autism. The key is consistency and early intervention. Would you like specific activity suggestions for your child's current goals?";
    } else {
      aiResponse += "I'm here to help you understand autism and support your child's development. I can provide information about interventions, help interpret assessment results, suggest daily activities, and connect you with resources. What specific aspect would you like to explore?";
    }
    
    const assistantMessage = await db.queryRow<Message>`
      INSERT INTO copilot_messages (conversation_id, role, content)
      VALUES (${req.conversationId}, 'assistant', ${aiResponse})
      RETURNING id, role, content, created_at as "createdAt"
    `;
    
    if (!assistantMessage) {
      throw new Error("Failed to save assistant message");
    }
    
    return { userMessage, assistantMessage };
  }
);
