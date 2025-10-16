import { api } from "encore.dev/api";
import db from "../db";

interface ListAssessmentsRequest {
  childId: number;
}

interface AssessmentSummary {
  id: number;
  sessionId: number;
  asdProbability: number;
  severityScore: number;
  recommendation: string;
  createdAt: Date;
}

interface ListAssessmentsResponse {
  assessments: AssessmentSummary[];
}

// Retrieves all assessments for a child.
export const listByChild = api<ListAssessmentsRequest, ListAssessmentsResponse>(
  { expose: true, method: "GET", path: "/assessment/child/:childId", auth: true },
  async (req) => {
    const assessments = await db.queryAll<AssessmentSummary>`
      SELECT 
        id, session_id as "sessionId", asd_probability as "asdProbability",
        severity_score as "severityScore", recommendation, created_at as "createdAt"
      FROM assessment_results
      WHERE child_id = ${req.childId}
      ORDER BY created_at DESC
    `;
    
    return { assessments };
  }
);
