import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface UpsertProtocolRequest {
  id?: number;
  title: string;
  category: string;
  content: string;
  evidenceLevel?: "high" | "moderate" | "low";
  references?: Array<{
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi?: string;
  }>;
  keywords?: string[];
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
  evidenceLevel: string | null;
  lastUpdated: string;
  keywords: string[] | null;
}

export const upsertProtocol = api<UpsertProtocolRequest, Protocol>(
  { expose: true, method: "POST", path: "/knowledge/protocols/upsert", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin" && auth.role !== "provider" && auth.role !== "doctor") {
      throw new Error("Access denied. Only providers/doctors and admins can upsert protocols.");
    }

    const refsJSON = req.references ? JSON.stringify(req.references) : null;
    const keywordsArr = req.keywords ?? null;

    if (req.id) {
      const updatedRow = await db.queryRow<{
        id: number;
        title: string;
        category: string;
        content: string;
        refs: Array<{ title: string; authors: string; journal: string; year: number; doi?: string }> | null;
        evidenceLevel: string | null;
        lastUpdated: string;
        keywords: string[] | null;
      }>`
        UPDATE clinical_protocols
        SET 
          title = ${req.title},
          category = ${req.category},
          content = ${req.content},
          evidence_level = ${req.evidenceLevel ?? null},
          refs = ${refsJSON},
          keywords = ${keywordsArr},
          last_updated = CURRENT_DATE
        WHERE id = ${req.id}
        RETURNING 
          id,
          title,
          category,
          content,
          refs,
          evidence_level as "evidenceLevel",
          last_updated as "lastUpdated",
          keywords
      `;
      if (!updatedRow) throw new Error("Protocol not found or update failed");
      const updated: Protocol = {
        id: updatedRow.id,
        title: updatedRow.title,
        category: updatedRow.category,
        content: updatedRow.content,
        references: updatedRow.refs ?? [],
        evidenceLevel: updatedRow.evidenceLevel ?? null,
        lastUpdated: updatedRow.lastUpdated,
        keywords: updatedRow.keywords,
      };
      return updated;
    }

    const insertedRow = await db.queryRow<{
      id: number;
      title: string;
      category: string;
      content: string;
      refs: Array<{ title: string; authors: string; journal: string; year: number; doi?: string }> | null;
      evidenceLevel: string | null;
      lastUpdated: string;
      keywords: string[] | null;
    }>`
      INSERT INTO clinical_protocols (
        title, category, content, evidence_level, refs, last_updated, keywords
      )
      VALUES (
        ${req.title}, ${req.category}, ${req.content}, ${req.evidenceLevel ?? null}, ${refsJSON}, CURRENT_DATE, ${keywordsArr}
      )
      RETURNING 
        id,
        title,
        category,
        content,
        refs,
        evidence_level as "evidenceLevel",
        last_updated as "lastUpdated",
        keywords
    `;

    if (!insertedRow) throw new Error("Failed to insert protocol");
    const inserted: Protocol = {
      id: insertedRow.id,
      title: insertedRow.title,
      category: insertedRow.category,
      content: insertedRow.content,
      references: insertedRow.refs ?? [],
      evidenceLevel: insertedRow.evidenceLevel ?? null,
      lastUpdated: insertedRow.lastUpdated,
      keywords: insertedRow.keywords,
    };
    return inserted;
  }
);