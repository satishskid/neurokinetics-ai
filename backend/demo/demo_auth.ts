import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

// Simple environment check for demo mode (works in development without secrets)
const isDemoEnvironment = () => {
  // Always enable demo mode for local development
  return true;
};

// Demo user credentials (for demo mode only)
const demoCredentials = {
  "admin@neurokinetics.demo": {
    userId: "demo_admin_001",
    role: "admin",
    email: "admin@neurokinetics.demo",
    name: "Dr. Sarah Johnson",
    organization: "NeuroKinetics Medical Center"
  },
  "therapist@neurokinetics.demo": {
    userId: "demo_provider_001", 
    role: "provider",
    email: "therapist@neurokinetics.demo",
    name: "Lisa Martinez, OT",
    organization: "Pediatric Therapy Specialists"
  },
  "parent1@neurokinetics.demo": {
    userId: "demo_parent_001",
    role: "parent", 
    email: "parent1@neurokinetics.demo",
    name: "Michael Chen",
    organization: "Family Account"
  },
  "parent2@neurokinetics.demo": {
    userId: "demo_parent_002",
    role: "parent",
    email: "parent2@neurokinetics.demo", 
    name: "Jennifer Williams",
    organization: "Family Account"
  }
};

// Demo login endpoint - bypasses real authentication for demo purposes
export const demoLogin = api<{ email: string; password: string }, { 
  success: boolean; 
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
    organization: string;
    token: string;
  };
  message?: string;
}>(
  { expose: true, method: "POST", path: "/demo/login", auth: false },
  async (req) => {
    // Check if demo mode is enabled (allow in development)
    const isDemoMode = isDemoEnvironment();
    if (!isDemoMode) {
      return { success: false, message: "Demo mode is disabled" };
    }

    const { email, password } = req;
    
    // For demo purposes, password is always "demo123"
    if (password !== "demo123") {
      return { success: false, message: "Invalid demo password. Use: demo123" };
    }

    const userData = demoCredentials[email as keyof typeof demoCredentials];
    if (!userData) {
      return { 
        success: false, 
        message: "Demo user not found. Available users: admin@neurokinetics.demo, therapist@neurokinetics.demo, parent1@neurokinetics.demo, parent2@neurokinetics.demo"
      };
    }

    // Generate a demo token (in real implementation, this would be a JWT)
    const demoToken = `demo_${userData.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      user: {
        id: userData.userId,
        email: userData.email,
        role: userData.role,
        name: userData.name,
        organization: userData.organization,
        token: demoToken
      }
    };
  }
);

// Get current demo user info
export const getDemoUserInfo = api<void, { 
  isDemoMode: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
    organization: string;
  };
}>(
  { expose: true, method: "GET", path: "/demo/user-info" },
  async () => {
    // Check if demo mode is enabled (allow in development)
    const isDemoMode = isDemoEnvironment();
    if (!isDemoMode) {
      return { isDemoMode: false };
    }

    try {
      const auth = getAuthData();
      if (!auth) {
        return { isDemoMode: true };
      }

      // Find demo user by clerk ID (which maps to our demo user ID)
      const userId = auth.userID;
      const userData = Object.values(demoCredentials).find(u => u.userId === userId);
      
      if (!userData) {
        return { isDemoMode: true };
      }

      return {
        isDemoMode: true,
        user: {
          id: userData.userId,
          email: userData.email,
          role: userData.role,
          name: userData.name,
          organization: userData.organization
        }
      };
    } catch (error) {
      return { isDemoMode: true };
    }
  }
);

// Quick demo switch endpoint - allows switching between demo users without full login
export const quickDemoSwitch = api<{ targetUserId: string }, { 
  success: boolean; 
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
    organization: string;
    token: string;
  };
  message?: string;
}>(
  { expose: true, method: "POST", path: "/demo/quick-switch", auth: false },
  async (req) => {
    // Check if demo mode is enabled (allow in development)
    const isDemoMode = isDemoEnvironment();
    if (!isDemoMode) {
      return { success: false, message: "Demo mode is disabled" };
    }

    const { targetUserId } = req;
    
    const userData = Object.values(demoCredentials).find(u => u.userId === targetUserId);
    if (!userData) {
      return { 
        success: false, 
        message: "Demo user not found. Available user IDs: demo_admin_001, demo_provider_001, demo_parent_001, demo_parent_002"
      };
    }

    const demoToken = `demo_${userData.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      user: {
        id: userData.userId,
        email: userData.email,
        role: userData.role,
        name: userData.name,
        organization: userData.organization,
        token: demoToken
      }
    };
  }
);