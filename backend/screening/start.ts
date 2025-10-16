import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface StartScreeningRequest {
  childId: number;
}

interface ScreeningSession {
  id: number;
  childId: number;
  userId: string;
  status: string;
  startedAt: Date;
}

// Starts a new screening session for a child.
export const start = api<StartScreeningRequest, ScreeningSession>(
  { expose: true, method: "POST", path: "/screening/start", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const session = await db.queryRow<ScreeningSession>`
      INSERT INTO screening_sessions (child_id, user_id, status)
      VALUES (${req.childId}, ${auth.userID}, 'in_progress')
      RETURNING id, child_id as "childId", user_id as "userId", status, started_at as "startedAt"
    `;
    
    if (!session) {
      throw new Error("Failed to start screening session");
    }
    
    return session;
  }
);
