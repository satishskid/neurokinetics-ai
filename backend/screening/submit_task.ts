import { api } from "encore.dev/api";
import db from "../db";

interface SubmitTaskRequest {
  sessionId: number;
  taskType: string;
  taskName: string;
  durationSeconds: number;
  engagementScore: number;
  rawData: Record<string, any>;
}

interface TaskResponse {
  id: number;
  success: boolean;
}

// Submits data for a completed screening task.
export const submitTask = api<SubmitTaskRequest, TaskResponse>(
  { expose: true, method: "POST", path: "/screening/task", auth: true },
  async (req) => {
    const task = await db.queryRow<{ id: number }>`
      INSERT INTO screening_tasks (
        session_id, task_type, task_name, started_at, completed_at, 
        duration_seconds, engagement_score, raw_data
      )
      VALUES (
        ${req.sessionId}, ${req.taskType}, ${req.taskName}, 
        CURRENT_TIMESTAMP - INTERVAL '1 second' * ${req.durationSeconds},
        CURRENT_TIMESTAMP, ${req.durationSeconds}, ${req.engagementScore}, ${JSON.stringify(req.rawData)}
      )
      RETURNING id
    `;
    
    if (!task) {
      throw new Error("Failed to submit task");
    }
    
    return { id: task.id, success: true };
  }
);
