import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface SearchProtocolsRequest {
  query: string;
  category?: string;
  limit?: number;
}

interface Protocol {
  id: number;
  title: string;
  category: string;
  content: string;
  references: Array<{
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi?: string;
  }>;
  evidenceLevel: string;
  lastUpdated: string;
}

interface SearchProtocolsResponse {
  protocols: Protocol[];
}

export const searchProtocols = api<SearchProtocolsRequest, SearchProtocolsResponse>(
  { expose: true, method: "POST", path: "/knowledge/protocols/search", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== "provider" && auth.role !== "admin" && auth.role !== "doctor") {
      throw new Error("Access denied. Clinical protocols are available to providers only.");
    }

    const limit = req.limit || 10;
    
    let protocols = await db.queryAll<Protocol>`
      SELECT 
        id, 
        title, 
        category, 
        content, 
        clinical_protocols.refs as "references", 
        evidence_level as "evidenceLevel",
        last_updated as "lastUpdated"
      FROM clinical_protocols
      WHERE 
        (${req.category} IS NULL OR category = ${req.category})
        AND (
          title ILIKE ${`%${req.query}%`}
          OR content ILIKE ${`%${req.query}%`}
          OR ${req.query} = ANY(keywords)
        )
      ORDER BY 
        CASE evidence_level
          WHEN 'high' THEN 1
          WHEN 'moderate' THEN 2
          WHEN 'low' THEN 3
        END,
        last_updated DESC
      LIMIT ${limit}
    `;

    return { protocols };
  }
);
