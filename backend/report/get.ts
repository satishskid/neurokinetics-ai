import { api, APIError } from "encore.dev/api";
import db from "../db";

interface GetReportRequest {
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

// Retrieves a clinical report by assessment ID.
export const get = api<GetReportRequest, ClinicalReport>(
  { expose: true, method: "GET", path: "/report/assessment/:assessmentId", auth: true },
  async (req) => {
    const report = await db.queryRow<ClinicalReport>`
      SELECT 
        id, assessment_id as "assessmentId", child_id as "childId", user_id as "userId",
        executive_summary as "executiveSummary", detailed_findings as "detailedFindings",
        parent_summary as "parentSummary", visual_analytics as "visualAnalytics",
        educational_resources as "educationalResources", created_at as "createdAt"
      FROM clinical_reports
      WHERE assessment_id = ${req.assessmentId}
    `;
    
    if (!report) {
      throw APIError.notFound("Report not found");
    }
    
    return report;
  }
);
