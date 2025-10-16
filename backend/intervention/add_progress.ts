import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface AddProgressRequest {
  interventionPlanId: number;
  childId: number;
  entryDate: Date;
  goalId: string;
  activityCompleted: boolean;
  observationNotes?: string;
  skillLevel?: number;
  behaviorFrequency?: number;
  milestoneAchieved?: boolean;
}

interface ProgressEntry {
  id: number;
  success: boolean;
}

// Records progress for an intervention plan goal.
export const addProgress = api<AddProgressRequest, ProgressEntry>(
  { expose: true, method: "POST", path: "/intervention/progress", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const entry = await db.queryRow<{ id: number }>`
      INSERT INTO progress_entries (
        intervention_plan_id, child_id, user_id, entry_date, goal_id,
        activity_completed, observation_notes, skill_level, behavior_frequency,
        milestone_achieved
      )
      VALUES (
        ${req.interventionPlanId}, ${req.childId}, ${auth.userID}, ${req.entryDate},
        ${req.goalId}, ${req.activityCompleted}, ${req.observationNotes || null},
        ${req.skillLevel || null}, ${req.behaviorFrequency || null},
        ${req.milestoneAchieved || false}
      )
      RETURNING id
    `;
    
    if (!entry) {
      throw new Error("Failed to add progress entry");
    }
    
    return { id: entry.id, success: true };
  }
);
