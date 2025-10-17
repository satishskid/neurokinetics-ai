import { api } from "encore.dev/api";
import db from "../db";
import { analyzeScreeningSession } from "../analysis/scoring";

interface CompleteScreeningRequest {
  sessionId: number;
}

interface CompleteScreeningResponse {
  success: boolean;
  assessmentId: number;
}

// Completes a screening session and triggers AI analysis.
export const complete = api<CompleteScreeningRequest, CompleteScreeningResponse>(
  { expose: true, method: "POST", path: "/screening/complete", auth: true },
  async (req) => {
    // Update session status
    await db.exec`
      UPDATE screening_sessions
      SET status = 'completed',
          completed_at = CURRENT_TIMESTAMP,
          total_duration_seconds = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at))
      WHERE id = ${req.sessionId}
    `;
    
    // Get session data
    const session = await db.queryRow<{ childId: number; userId: string }>`
      SELECT child_id as "childId", user_id as "userId"
      FROM screening_sessions
      WHERE id = ${req.sessionId}
    `;
    
    if (!session) {
      throw new Error("Session not found");
    }
    
    // Deterministic analysis based on collected tasks
    const analysis = await analyzeScreeningSession(req.sessionId);
    
    const assessment = await db.queryRow<{ id: number }>`
      INSERT INTO assessment_results (
        session_id, child_id, user_id, asd_probability, confidence_level,
        severity_score, social_communication_score, repetitive_behaviors_score,
        sensory_processing_score, motor_coordination_score, red_flags,
        key_observations, recommendation, analysis_data
      )
      VALUES (
        ${req.sessionId}, ${session.childId}, ${session.userId},
        ${analysis.asdProbability}, ${analysis.confidenceLevel},
        ${analysis.severityScore}, ${analysis.socialCommunicationScore}, ${analysis.repetitiveBehaviorsScore},
        ${analysis.sensoryProcessingScore}, ${analysis.motorCoordinationScore},
        ${JSON.stringify(analysis.redFlags)}, ${JSON.stringify(analysis.keyObservations)},
        ${analysis.recommendation}, ${JSON.stringify(analysis.analysisData)}
      )
      RETURNING id
    `;
    
    if (!assessment) {
      throw new Error("Failed to create assessment");
    }
    
    return { success: true, assessmentId: assessment.id };
  }
);
