import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface CreateChildRequest {
  name: string;
  dateOfBirth: Date;
  ageMonths: number;
  sex: "male" | "female" | "other";
  developmentalConcerns?: string;
}

interface Child {
  id: number;
  userId: string;
  name: string;
  dateOfBirth: Date;
  ageMonths: number;
  sex: string;
  developmentalConcerns?: string;
  createdAt: Date;
}

// Creates a new child profile.
export const create = api<CreateChildRequest, Child>(
  { expose: true, method: "POST", path: "/children", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const row = await db.queryRow<Child>`
      INSERT INTO children (user_id, name, date_of_birth, age_months, sex, developmental_concerns)
      VALUES (${auth.userID}, ${req.name}, ${req.dateOfBirth}, ${req.ageMonths}, ${req.sex}, ${req.developmentalConcerns || null})
      RETURNING id, user_id as "userId", name, date_of_birth as "dateOfBirth", 
                age_months as "ageMonths", sex, developmental_concerns as "developmentalConcerns",
                created_at as "createdAt"
    `;
    
    if (!row) {
      throw new Error("Failed to create child");
    }
    
    return row;
  }
);
