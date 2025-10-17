import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface UpsertEducationRequest {
  id?: number;
  title: string;
  category: string;
  content: string;
  ageRange?: string;
  references?: Array<{
    title: string;
    source: string;
    url?: string;
  }>;
  keywords?: string[];
}

interface EducationResource {
  id: number;
  title: string;
  category: string;
  content: string;
  ageRange?: string;
  references: Array<{
    title: string;
    source: string;
    url?: string;
  }>;
  lastUpdated: string;
  keywords: string[] | null;
}

export const upsertEducation = api<UpsertEducationRequest, EducationResource>(
  { expose: true, method: "POST", path: "/knowledge/education/upsert", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin" && auth.role !== "provider" && auth.role !== "doctor") {
      throw new Error("Access denied. Only providers/doctors and admins can upsert education resources.");
    }

    const refsJSON = req.references ? JSON.stringify(req.references) : null;
    const keywordsArr = req.keywords ?? null;

    if (req.id) {
      const updated = await db.queryRow<EducationResource>`
        UPDATE patient_education
        SET 
          title = ${req.title},
          category = ${req.category},
          content = ${req.content},
          age_range = ${req.ageRange ?? null},
          references = ${refsJSON},
          keywords = ${keywordsArr},
          last_updated = CURRENT_DATE
        WHERE id = ${req.id}
        RETURNING 
          id,
          title,
          category,
          content,
          age_range as "ageRange",
          patient_education.references,
          last_updated as "lastUpdated",
          keywords
      `;
      if (!updated) throw new Error("Education resource not found or update failed");
      return updated;
    }

    const inserted = await db.queryRow<EducationResource>`
      INSERT INTO patient_education (
        title, category, content, age_range, references, last_updated, keywords
      )
      VALUES (
        ${req.title}, ${req.category}, ${req.content}, ${req.ageRange ?? null}, ${refsJSON}, CURRENT_DATE, ${keywordsArr}
      )
      RETURNING 
        id,
        title,
        category,
        content,
        age_range as "ageRange",
        patient_education.references,
        last_updated as "lastUpdated",
        keywords
    `;

    if (!inserted) throw new Error("Failed to insert education resource");
    return inserted;
  }
);