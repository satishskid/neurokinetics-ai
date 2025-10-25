import { api } from "encore.dev/api";

// Simple environment check for demo mode (works in development without secrets)
const isDemoEnvironment = () => {
  // Always enable demo mode for local development
  return true;
};

// Get comprehensive demo dashboard data
export const getDemoDashboard = api<void, {
  isDemoMode: boolean;
  demoScenarios: {
    users: Array<{
      id: string;
      email: string;
      role: string;
      name: string;
      organization: string;
      childrenCount: number;
      recentActivity: string;
    }>;
    children: Array<{
      id: number;
      name: string;
      age: number;
      sex: string;
      primaryConcerns: string;
      assessmentStatus: string;
      interventionPlan: boolean;
      lastActivity: string;
    }>;
    features: Array<{
      name: string;
      description: string;
      demoDataAvailable: boolean;
      quickAccess: string;
    }>;
  };
  quickStartGuide: {
    title: string;
    steps: string[];
    tips: string[];
  };
}>(
  { expose: true, method: "GET", path: "/demo/dashboard" },
  async () => {
    // Check if demo mode is enabled (allow in development)
    const isDemoMode = isDemoEnvironment();
    if (!isDemoMode) {
      return { 
        isDemoMode: false,
        demoScenarios: { users: [], children: [], features: [] },
        quickStartGuide: { title: "", steps: [], tips: [] }
      };
    }

    try {
      // Hardcoded demo users
      const demoUsers = [
        {
          id: "demo_admin_001",
          email: "admin@neurokinetics.demo",
          role: "admin",
          name: "Dr. Sarah Johnson",
          organization: "NeuroKinetics Demo Clinic",
          childrenCount: 4,
          recentActivity: "2 hours ago"
        },
        {
          id: "demo_provider_001",
          email: "therapist@neurokinetics.demo",
          role: "provider",
          name: "Michael Chen, BCBA",
          organization: "NeuroKinetics Demo Clinic",
          childrenCount: 3,
          recentActivity: "1 hour ago"
        },
        {
          id: "demo_parent1_001",
          email: "parent1@neurokinetics.demo",
          role: "parent",
          name: "Emily Rodriguez",
          organization: "Demo Family Account",
          childrenCount: 1,
          recentActivity: "30 minutes ago"
        },
        {
          id: "demo_parent2_001",
          email: "parent2@neurokinetics.demo",
          role: "parent",
          name: "David Thompson",
          organization: "Demo Family Account",
          childrenCount: 1,
          recentActivity: "45 minutes ago"
        }
      ];

      // Hardcoded demo children
      const demoChildren = [
        {
          id: 1,
          name: "Alex Johnson",
          age: 4,
          sex: "male",
          primaryConcerns: "Speech delay, social interaction difficulties",
          assessmentStatus: "Assessment Complete",
          interventionPlan: true,
          lastActivity: "2 hours ago"
        },
        {
          id: 2,
          name: "Sophia Chen",
          age: 3,
          sex: "female",
          primaryConcerns: "Repetitive behaviors, sensory sensitivities",
          assessmentStatus: "Screening In Progress",
          interventionPlan: false,
          lastActivity: "1 hour ago"
        },
        {
          id: 3,
          name: "Marcus Rodriguez",
          age: 5,
          sex: "male",
          primaryConcerns: "Communication delays, limited eye contact",
          assessmentStatus: "Assessment Complete",
          interventionPlan: true,
          lastActivity: "30 minutes ago"
        },
        {
          id: 4,
          name: "Luna Thompson",
          age: 2,
          sex: "female",
          primaryConcerns: "Social engagement, play skills",
          assessmentStatus: "New Patient",
          interventionPlan: false,
          lastActivity: "45 minutes ago"
        }
      ];

      // Define available features for demo
      const demoFeatures = [
        {
          name: "Child Registration & Management",
          description: "Add new patients, manage profiles, track developmental history",
          demoDataAvailable: true,
          quickAccess: "/children"
        },
        {
          name: "Developmental Screening",
          description: "Interactive screening games and activities for children",
          demoDataAvailable: true,
          quickAccess: "/screening"
        },
        {
          name: "AI-Powered Assessment",
          description: "Comprehensive assessment with AI analysis and recommendations",
          demoDataAvailable: true,
          quickAccess: "/assessment"
        },
        {
          name: "CareBuddy AI Assistant",
          description: "24/7 AI support for parents and providers with personalized guidance",
          demoDataAvailable: true,
          quickAccess: "/carebuddy"
        },
        {
          name: "Intervention Planning",
          description: "Create personalized intervention plans with goals and strategies",
          demoDataAvailable: true,
          quickAccess: "/intervention"
        },
        {
          name: "Progress Tracking",
          description: "Monitor child progress with visual charts and milestone tracking",
          demoDataAvailable: true,
          quickAccess: "/progress"
        },
        {
          name: "Clinical Reports",
          description: "Generate comprehensive PDF reports for medical records",
          demoDataAvailable: true,
          quickAccess: "/reports"
        },
        {
          name: "Knowledge Library",
          description: "Access clinical protocols and parent education materials",
          demoDataAvailable: true,
          quickAccess: "/knowledge"
        }
      ];

      return {
        isDemoMode: true,
        demoScenarios: {
          users: demoUsers,
          children: demoChildren,
          features: demoFeatures
        },
        quickStartGuide: {
          title: "🚀 NeuroKinetics AI Demo Guide",
          steps: [
            "Choose a demo user role (Admin, Provider, or Parent)",
            "Explore the dashboard and available features",
            "Select a child profile to see their assessment data",
            "Try the CareBuddy AI assistant for guidance",
            "Generate a sample clinical report",
            "Review intervention plans and progress tracking"
          ],
          tips: [
            "💡 Use 'demo123' as the password for all demo accounts",
            "🔍 Each user role has different permissions and views",
            "📊 Sample data includes realistic assessment results",
            "🤖 CareBuddy has pre-loaded conversation examples",
            "📋 Try switching between users to see different perspectives"
          ]
        }
      };
    } catch (error) {
      console.error("Error generating demo dashboard:", error);
      return {
        isDemoMode: true,
        demoScenarios: { users: [], children: [], features: [] },
        quickStartGuide: {
          title: "Demo Dashboard Error",
          steps: ["Please ensure demo data is set up first"],
          tips: ["Run POST /demo/setup to initialize demo data"]
        }
      };
    }
  }
);

// Helper function to format recent activity
function formatRecentActivity(lastAssessment: string, lastChildUpdate: string): string {
  const assessmentDate = lastAssessment ? new Date(lastAssessment) : null;
  const updateDate = lastChildUpdate ? new Date(lastChildUpdate) : null;
  
  const mostRecent = assessmentDate && updateDate 
    ? (assessmentDate > updateDate ? assessmentDate : updateDate)
    : (assessmentDate || updateDate);
    
  if (!mostRecent) return "No recent activity";
  
  return formatTimeAgo(mostRecent);
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
}

// Get demo statistics
export const getDemoStats = api<void, {
  isDemoMode: boolean;
  stats: {
    totalUsers: number;
    totalChildren: number;
    completedAssessments: number;
    activeInterventions: number;
    careBuddyConversations: number;
    clinicalProtocols: number;
    educationMaterials: number;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
}>(
  { expose: true, method: "GET", path: "/demo/stats" },
  async () => {
    // Check if demo mode is enabled (allow in development)
    const isDemoMode = isDemoEnvironment();
    if (!isDemoMode) {
      return { isDemoMode: false, stats: { totalUsers: 0, totalChildren: 0, completedAssessments: 0, activeInterventions: 0, careBuddyConversations: 0, clinicalProtocols: 0, educationMaterials: 0 }, recentActivity: [] };
    }

    try {
      // Hardcoded demo statistics
      const stats = {
        total_users: 4,
        total_children: 4,
        completed_assessments: 2,
        active_interventions: 2,
        conversations: 12,
        protocols: 8,
        education: 15
      };

      // Hardcoded recent activity
      const recentActivity = [
        {
          type: 'assessment',
          description: 'Assessment completed for Alex Johnson',
          timestamp: '2 hours ago',
          user: 'Dr. Sarah Johnson'
        },
        {
          type: 'screening',
          description: 'Screening session started for Sophia Chen',
          timestamp: '1 hour ago',
          user: 'Michael Chen, BCBA'
        },
        {
          type: 'intervention',
          description: 'Intervention plan created for Marcus Rodriguez',
          timestamp: '30 minutes ago',
          user: 'Dr. Sarah Johnson'
        },
        {
          type: 'assessment',
          description: 'Assessment completed for Marcus Rodriguez',
          timestamp: '45 minutes ago',
          user: 'Michael Chen, BCBA'
        },
        {
          type: 'screening',
          description: 'New patient screening for Luna Thompson',
          timestamp: '1 hour ago',
          user: 'Dr. Sarah Johnson'
        }
      ];

      return {
        isDemoMode: true,
        stats: {
          totalUsers: parseInt(stats.total_users),
          totalChildren: parseInt(stats.total_children),
          completedAssessments: parseInt(stats.completed_assessments),
          activeInterventions: parseInt(stats.active_interventions),
          careBuddyConversations: parseInt(stats.conversations),
          clinicalProtocols: parseInt(stats.protocols),
          educationMaterials: parseInt(stats.education)
        },
        recentActivity
      };
    } catch (error) {
      console.error("Error getting demo stats:", error);
      return {
        isDemoMode: true,
        stats: { totalUsers: 0, totalChildren: 0, completedAssessments: 0, activeInterventions: 0, careBuddyConversations: 0, clinicalProtocols: 0, educationMaterials: 0 },
        recentActivity: []
      };
    }
  }
);