import { api, APIError } from "encore.dev/api";
import db from "../db";

interface GetInterventionRequest {
  childId: number;
}

interface InterventionPlan {
  id: number;
  childId: number;
  assessmentId: number;
  userId: string;
  priorityGoals: Array<{
    id: string;
    goal: string;
    rationale: string;
    timeline: string;
    measurable: string;
  }>;
  interventionStrategies: Record<string, string[]>;
  dailySchedule: Array<{ time: string; activity: string; duration: number }>;
  status: string;
  createdAt: Date;
}

// Retrieves the active intervention plan for a child.
export const get = api<GetInterventionRequest, InterventionPlan>(
  { expose: true, method: "GET", path: "/intervention/child/:childId", auth: true },
  async (req) => {
    const plan = await db.queryRow<InterventionPlan>`
      SELECT 
        id, child_id as "childId", assessment_id as "assessmentId", user_id as "userId",
        priority_goals as "priorityGoals", intervention_strategies as "interventionStrategies",
        daily_schedule as "dailySchedule", status, created_at as "createdAt"
      FROM intervention_plans
      WHERE child_id = ${req.childId} AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    if (!plan) {
      throw APIError.notFound("No active intervention plan found");
    }
    
    return plan;
  }
);
