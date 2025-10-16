import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

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

interface ListChildrenResponse {
  children: Child[];
}

// Retrieves all children for a user.
export const list = api<void, ListChildrenResponse>(
  { expose: true, method: "GET", path: "/children", auth: true },
  async () => {
    const auth = getAuthData()!;
    const children = await db.queryAll<Child>`
      SELECT id, user_id as "userId", name, date_of_birth as "dateOfBirth",
             age_months as "ageMonths", sex, developmental_concerns as "developmentalConcerns",
             created_at as "createdAt"
      FROM children
      WHERE user_id = ${auth.userID}
      ORDER BY created_at DESC
    `;
    
    return { children };
  }
);
