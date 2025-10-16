import { api } from "encore.dev/api";
import db from "../db";

interface GenerateReportRequest {
  assessmentId: number;
}

interface ClinicalReport {
  id: number;
  assessmentId: number;
  childId: number;
  userId: string;
  executiveSummary: string;
  detailedFindings: string;
  parentSummary: string;
  visualAnalytics: Record<string, any>;
  educationalResources: Array<{ title: string; url: string; description: string }>;
  createdAt: Date;
}

// Generates a comprehensive clinical report from an assessment.
export const generate = api<GenerateReportRequest, ClinicalReport>(
  { expose: true, method: "POST", path: "/report/generate", auth: true },
  async (req) => {
    // Get assessment data
    const assessment = await db.queryRow<{
      childId: number;
      userId: string;
      asdProbability: number;
      severityScore: number;
      socialCommunicationScore: number;
    }>`
      SELECT child_id as "childId", user_id as "userId", asd_probability as "asdProbability",
             severity_score as "severityScore", social_communication_score as "socialCommunicationScore"
      FROM assessment_results
      WHERE id = ${req.assessmentId}
    `;
    
    if (!assessment) {
      throw new Error("Assessment not found");
    }
    
    // Check if report already exists
    const existing = await db.queryRow<{ id: number }>`
      SELECT id FROM clinical_reports WHERE assessment_id = ${req.assessmentId}
    `;
    
    if (existing) {
      const report = await db.queryRow<ClinicalReport>`
        SELECT 
          id, assessment_id as "assessmentId", child_id as "childId", user_id as "userId",
          executive_summary as "executiveSummary", detailed_findings as "detailedFindings",
          parent_summary as "parentSummary", visual_analytics as "visualAnalytics",
          educational_resources as "educationalResources", created_at as "createdAt"
        FROM clinical_reports
        WHERE id = ${existing.id}
      `;
      return report!;
    }
    
    // Generate report content (simulated - in production would use AI)
    const executiveSummary = `Clinical screening indicates an ASD probability of ${assessment.asdProbability.toFixed(1)}% with ${assessment.severityScore === 3 ? 'substantial' : assessment.severityScore === 2 ? 'moderate' : 'mild'} severity indicators. Comprehensive diagnostic evaluation recommended.`;
    
    const detailedFindings = `Social Communication Domain: Score ${assessment.socialCommunicationScore.toFixed(1)}/100\n\nKey observations include reduced eye contact during social stimuli, delayed response to name calling, and limited joint attention behaviors. Behavioral patterns align with DSM-5 criteria for autism spectrum considerations.`;
    
    const parentSummary = `Your child's screening shows some differences in social communication and interaction patterns compared to typical development for their age. This doesn't mean a diagnosis, but suggests that a comprehensive evaluation by a specialist would be helpful. Early intervention has been shown to significantly improve outcomes.`;
    
    const visualAnalytics = {
      domainScores: {
        socialCommunication: assessment.socialCommunicationScore,
        repetitiveBehaviors: 42.5,
        sensoryProcessing: 48.3,
        motorCoordination: 62.1
      },
      gazeHeatmap: { description: 'Reduced fixation on social stimuli compared to objects' },
      temporalPatterns: { description: 'Delayed response latencies observed' }
    };
    
    const educationalResources = [
      {
        title: 'Understanding Autism Spectrum Disorder',
        url: 'https://www.autismspeaks.org/what-autism',
        description: 'Comprehensive overview of ASD and early signs'
      },
      {
        title: 'Early Intervention Benefits',
        url: 'https://www.cdc.gov/ncbddd/autism/treatment.html',
        description: 'Information about treatment options and their effectiveness'
      }
    ];
    
    const report = await db.queryRow<ClinicalReport>`
      INSERT INTO clinical_reports (
        assessment_id, child_id, user_id, executive_summary, detailed_findings,
        parent_summary, visual_analytics, educational_resources
      )
      VALUES (
        ${req.assessmentId}, ${assessment.childId}, ${assessment.userId},
        ${executiveSummary}, ${detailedFindings}, ${parentSummary},
        ${JSON.stringify(visualAnalytics)}, ${JSON.stringify(educationalResources)}
      )
      RETURNING 
        id, assessment_id as "assessmentId", child_id as "childId", user_id as "userId",
        executive_summary as "executiveSummary", detailed_findings as "detailedFindings",
        parent_summary as "parentSummary", visual_analytics as "visualAnalytics",
        educational_resources as "educationalResources", created_at as "createdAt"
    `;
    
    if (!report) {
      throw new Error("Failed to generate report");
    }
    
    return report;
  }
);
