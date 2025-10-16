import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface CreateInterventionRequest {
  childId: number;
  assessmentId: number;
}

interface InterventionPlan {
  id: number;
  childId: number;
  assessmentId: number;
  userId: string;
  priorityGoals: Array<{
    id: string;
    goal: string;
    rationale: string;
    timeline: string;
    measurable: string;
  }>;
  interventionStrategies: Record<string, string[]>;
  dailySchedule: Array<{ time: string; activity: string; duration: number }>;
  status: string;
  createdAt: Date;
}

// Creates a personalized intervention plan based on assessment results.
export const create = api<CreateInterventionRequest, InterventionPlan>(
  { expose: true, method: "POST", path: "/intervention/create", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    // Simulated AI-generated intervention plan
    const priorityGoals = [
      {
        id: 'goal-1',
        goal: 'Increase spontaneous eye contact during play from current 10% to 40%',
        rationale: 'Foundation for social communication development',
        timeline: '12 weeks',
        measurable: 'Track percentage of play interactions with eye contact'
      },
      {
        id: 'goal-2',
        goal: 'Respond to name within 2 seconds in 80% of opportunities',
        rationale: 'Critical for safety and social engagement',
        timeline: '8 weeks',
        measurable: 'Daily name-calling trials with response timing'
      },
      {
        id: 'goal-3',
        goal: 'Initiate joint attention behaviors 5 times per play session',
        rationale: 'Essential for language and social development',
        timeline: '10 weeks',
        measurable: 'Count of pointing, showing, or gaze-shifting behaviors'
      }
    ];
    
    const interventionStrategies = {
      socialCommunication: [
        'Use exaggerated facial expressions and animated voice during play',
        'Practice turn-taking games with preferred toys',
        'Create communication temptations to encourage requests',
        'Implement video modeling for social scenarios'
      ],
      behaviorManagement: [
        'Establish consistent visual schedules for daily routines',
        'Use positive reinforcement for desired behaviors',
        'Provide sensory breaks every 30 minutes',
        'Teach replacement behaviors for challenging actions'
      ],
      languageDevelopment: [
        'Label objects and actions throughout the day',
        'Use simple language with visual supports',
        'Practice requesting with core vocabulary',
        'Sing songs with gestures and actions'
      ]
    };
    
    const dailySchedule = [
      { time: '08:00', activity: 'Morning routine with visual schedule', duration: 30 },
      { time: '09:00', activity: 'Structured play session - social skills', duration: 20 },
      { time: '10:00', activity: 'Sensory regulation activities', duration: 15 },
      { time: '11:00', activity: 'Communication practice during snack', duration: 20 },
      { time: '14:00', activity: 'Motor skills and imitation games', duration: 25 },
      { time: '16:00', activity: 'Parent-child interaction practice', duration: 30 }
    ];
    
    const plan = await db.queryRow<InterventionPlan>`
      INSERT INTO intervention_plans (
        child_id, assessment_id, user_id, priority_goals, intervention_strategies,
        daily_schedule, status
      )
      VALUES (
        ${req.childId}, ${req.assessmentId}, ${auth.userID},
        ${JSON.stringify(priorityGoals)}, ${JSON.stringify(interventionStrategies)},
        ${JSON.stringify(dailySchedule)}, 'active'
      )
      RETURNING 
        id, child_id as "childId", assessment_id as "assessmentId", user_id as "userId",
        priority_goals as "priorityGoals", intervention_strategies as "interventionStrategies",
        daily_schedule as "dailySchedule", status, created_at as "createdAt"
    `;
    
    if (!plan) {
      throw new Error("Failed to create intervention plan");
    }
    
    return plan;
  }
);
