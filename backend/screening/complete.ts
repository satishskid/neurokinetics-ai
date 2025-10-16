import { api } from "encore.dev/api";
import db from "../db";

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
    
    // Simulate AI analysis (in production, this would call the actual AI model)
    const asdProbability = Math.random() * 40 + 30; // 30-70% range for demo
    const severityScore = asdProbability > 60 ? 3 : asdProbability > 45 ? 2 : 1;
    
    const assessment = await db.queryRow<{ id: number }>`
      INSERT INTO assessment_results (
        session_id, child_id, user_id, asd_probability, confidence_level,
        severity_score, social_communication_score, repetitive_behaviors_score,
        sensory_processing_score, motor_coordination_score, red_flags,
        key_observations, recommendation
      )
      VALUES (
        ${req.sessionId}, ${session.childId}, ${session.userId},
        ${asdProbability}, ${asdProbability > 55 ? 'high' : asdProbability > 40 ? 'medium' : 'low'},
        ${severityScore}, ${Math.random() * 40 + 40}, ${Math.random() * 30 + 35},
        ${Math.random() * 35 + 40}, ${Math.random() * 25 + 50},
        ${JSON.stringify(['Reduced eye contact during social stimuli', 'Delayed response to name calling'])},
        ${JSON.stringify([{timestamp: '00:02:15', behavior: 'Limited joint attention'}, {timestamp: '00:04:30', behavior: 'Preference for repetitive activities'}])},
        ${asdProbability > 50 ? 'refer_for_diagnostic' : 'monitor'}
      )
      RETURNING id
    `;
    
    if (!assessment) {
      throw new Error("Failed to create assessment");
    }
    
    return { success: true, assessmentId: assessment.id };
  }
);
