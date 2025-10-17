import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface GetAssessmentRequest {
  id: number;
}

interface AssessmentResult {
  id: number;
  sessionId: number;
  childId: number;
  userId: string;
  asdProbability: number;
  confidenceLevel: string;
  severityScore: number;
  socialCommunicationScore: number;
  repetitiveBehaviorsScore: number;
  sensoryProcessingScore: number;
  motorCoordinationScore: number;
  redFlags: string[];
  keyObservations: Array<{ timestamp: string; behavior: string }>;
  recommendation: string;
  analysisData: Record<string, any>;
  createdAt: Date;
}

// Retrieves an assessment result by ID.
export const get = api<GetAssessmentRequest, AssessmentResult>(
  { expose: true, method: "GET", path: "/assessment/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const assessment = await db.queryRow<AssessmentResult>`
      SELECT 
        id, session_id as "sessionId", child_id as "childId", user_id as "userId",
        asd_probability as "asdProbability", confidence_level as "confidenceLevel",
        severity_score as "severityScore", 
        social_communication_score as "socialCommunicationScore",
        repetitive_behaviors_score as "repetitiveBehaviorsScore",
        sensory_processing_score as "sensoryProcessingScore",
        motor_coordination_score as "motorCoordinationScore",
        red_flags as "redFlags", key_observations as "keyObservations",
        recommendation, analysis_data as "analysisData", created_at as "createdAt"
      FROM assessment_results
      WHERE id = ${req.id} AND user_id = ${auth.userID}
    `;
    
    if (!assessment) {
      throw APIError.notFound("Assessment not found");
    }
    
    return assessment;
  }
);
