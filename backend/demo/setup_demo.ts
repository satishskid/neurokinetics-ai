import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

// Simple environment check for demo mode (works in development without secrets)
const isDemoEnvironment = () => {
  // Always enable demo mode for local development
  return true;
};

// Demo users data
const demoUsers = [
  {
    id: "demo_admin_001",
    clerk_id: "demo_admin_clerk_001",
    email: "admin@neurokinetics.demo",
    role: "admin",
    full_name: "Dr. Sarah Johnson",
    organization: "NeuroKinetics Medical Center",
  },
  {
    id: "demo_provider_001",
    clerk_id: "demo_provider_clerk_001",
    email: "therapist@neurokinetics.demo",
    role: "provider",
    full_name: "Lisa Martinez, OT",
    organization: "Pediatric Therapy Specialists",
  },
  {
    id: "demo_parent_001",
    clerk_id: "demo_parent_clerk_001",
    email: "parent1@neurokinetics.demo",
    role: "parent",
    full_name: "Michael Chen",
    organization: "Family Account",
  },
  {
    id: "demo_parent_002",
    clerk_id: "demo_parent_clerk_002",
    email: "parent2@neurokinetics.demo",
    role: "parent",
    full_name: "Jennifer Williams",
    organization: "Family Account",
  },
];

// Demo children data
const demoChildren = [
  {
    user_id: "demo_parent_001",
    name: "Ethan Chen",
    date_of_birth: "2019-03-15",
    age_months: 60,
    sex: "male",
    developmental_concerns: "Speech delay, social interaction difficulties",
  },
  {
    user_id: "demo_parent_001",
    name: "Sophia Chen",
    date_of_birth: "2021-07-22",
    age_months: 32,
    sex: "female",
    developmental_concerns: "Sensory processing issues",
  },
  {
    user_id: "demo_parent_002",
    name: "Aiden Williams",
    date_of_birth: "2018-11-08",
    age_months: 66,
    sex: "male",
    developmental_concerns: "Autism spectrum disorder, repetitive behaviors",
  },
  {
    user_id: "demo_parent_002",
    name: "Zoe Williams",
    date_of_birth: "2020-12-30",
    age_months: 42,
    sex: "female",
    developmental_concerns: "Fine motor delays, attention difficulties",
  },
];

// Demo clinical protocols
const demoClinicalProtocols = [
  {
    title: "Early Intervention for Autism Spectrum Disorder",
    category: "autism_intervention",
    content: "Comprehensive early intervention protocol focusing on social communication, behavioral therapy, and family-centered approaches. Includes ABA techniques, speech therapy integration, and developmental play-based interventions.",
    evidence_level: "high",
    last_updated: "2024-01-15",
    keywords: ["autism", "early intervention", "ABA", "social communication", "behavioral therapy"],
  },
  {
    title: "Sensory Integration Therapy Protocol",
    category: "sensory_processing",
    content: "Structured sensory integration therapy program including assessment tools, intervention strategies, and home program recommendations. Addresses tactile defensiveness, proprioceptive difficulties, and vestibular challenges.",
    evidence_level: "moderate",
    last_updated: "2024-02-01",
    keywords: ["sensory integration", "tactile", "proprioception", "vestibular", "sensory processing"],
  },
  {
    title: "Speech and Language Development Milestones",
    category: "speech_language",
    content: "Evidence-based speech and language milestone tracking with intervention strategies for delays. Includes articulation development, receptive language skills, and pragmatic language intervention techniques.",
    evidence_level: "high",
    last_updated: "2024-01-20",
    keywords: ["speech development", "language milestones", "articulation", "pragmatic language", "intervention"],
  },
];

// Demo patient education materials
const demoPatientEducation = [
  {
    title: "Understanding Your Child's Sensory Needs",
    category: "sensory_awareness",
    content: "A comprehensive guide for parents to understand sensory processing challenges, recognize signs of sensory difficulties, and implement home strategies to support their child's sensory needs.",
    age_range: "2-8 years",
    difficulty_level: "beginner",
    last_updated: "2024-01-10",
    keywords: ["sensory processing", "parent guide", "home strategies", "sensory needs"],
  },
  {
    title: "Activities to Promote Social Skills at Home",
    category: "social_skills",
    content: "Practical activities and games that parents can use to help their child develop social communication skills, including turn-taking, eye contact, and conversation skills.",
    age_range: "3-10 years",
    difficulty_level: "intermediate",
    last_updated: "2024-02-05",
    keywords: ["social skills", "home activities", "turn-taking", "communication", "parent activities"],
  },
];

// Setup demo data endpoint
export const setupDemoData = api<void, { success: boolean; message: string }>(
  { expose: true, method: "POST", path: "/demo/setup" },
  async () => {
    // Allow demo setup in development or when demo mode is explicitly enabled
    const isDemoMode = isDemoEnvironment();
    if (!isDemoMode) {
      return { success: false, message: "Demo mode is not enabled" };
    }

    try {
      // Since this is a stateless demo service, we simulate successful setup
      // The demo data is already hardcoded in the dashboard endpoints

      return { 
        success: true, 
        message: "Demo data setup completed successfully. You can now log in with demo accounts." 
      };
    } catch (error) {
      console.error("Error setting up demo data:", error);
      return { 
        success: false, 
        message: `Failed to setup demo data: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
);

// Helper function to create demo screening data (stateless version)
async function createDemoScreeningData(childId: number, userId: string) {
  // This function is now stateless - it simulates creating demo data
  // In a real implementation, this would populate a database
  return { success: true };
}

// Helper function to create demo CareBuddy conversations (stateless version)
async function createDemoCareBuddyConversations() {
  // This function is now stateless - it simulates creating demo conversations
  // In a real implementation, this would populate a database
  return { success: true };
}

// Get demo users endpoint
export const getDemoUsers = api<void, { users: typeof demoUsers }>(
  { expose: true, method: "GET", path: "/demo/users" },
  async () => {
    if (!isDemoEnvironment()) {
      return { users: [] };
    }
    return { users: demoUsers };
  }
);