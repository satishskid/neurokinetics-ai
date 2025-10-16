import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface GetChildRequest {
  id: number;
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

// Retrieves a child's profile by ID.
export const get = api<GetChildRequest, Child>(
  { expose: true, method: "GET", path: "/children/detail/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const child = await db.queryRow<Child>`
      SELECT id, user_id as "userId", name, date_of_birth as "dateOfBirth",
             age_months as "ageMonths", sex, developmental_concerns as "developmentalConcerns",
             created_at as "createdAt"
      FROM children
      WHERE id = ${req.id} AND user_id = ${auth.userID}
    `;
    
    if (!child) {
      throw APIError.notFound("Child not found");
    }
    
    return child;
  }
);
