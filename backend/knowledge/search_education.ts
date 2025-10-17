import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface SearchEducationRequest {
  query: string;
  category?: string;
  ageRange?: string;
  limit?: number;
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
}

interface SearchEducationResponse {
  resources: EducationResource[];
}

export const searchEducation = api<SearchEducationRequest, SearchEducationResponse>(
  { expose: true, method: "POST", path: "/knowledge/education/search", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== "parent" && auth.role !== "admin") {
      throw new Error("Access denied. Patient education is available to parents only.");
    }

    const limit = req.limit || 10;
    
    let resources = await db.queryAll<EducationResource>`
      SELECT 
        id, 
        title, 
        category, 
        content, 
        age_range as "ageRange",
        patient_education.references, 
        last_updated as "lastUpdated"
      FROM patient_education
      WHERE 
        (${req.category} IS NULL OR category = ${req.category})
        AND (${req.ageRange} IS NULL OR age_range = ${req.ageRange})
        AND (
          title ILIKE ${`%${req.query}%`}
          OR content ILIKE ${`%${req.query}%`}
          OR ${req.query} = ANY(keywords)
        )
      ORDER BY last_updated DESC
      LIMIT ${limit}
    `;

    return { resources };
  }
);
