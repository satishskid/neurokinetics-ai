import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Stethoscope, Baby, Brain, FileText, MessageSquare, TrendingUp } from 'lucide-react';

interface DemoUser {
  id: string;
  email: string;
  role: string;
  name: string;
  organization: string;
  childrenCount: number;
  recentActivity: string;
}

interface DemoChild {
  id: number;
  name: string;
  age: number;
  sex: string;
  primaryConcerns: string;
  assessmentStatus: string;
  interventionPlan: boolean;
  lastActivity: string;
}

interface DemoFeature {
  name: string;
  description: string;
  demoDataAvailable: boolean;
  quickAccess: string;
}

export const DemoMode: React.FC = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [demoChildren, setDemoChildren] = useState<DemoChild[]>([]);
  const [demoFeatures, setDemoFeatures] = useState<DemoFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    checkDemoStatus();
  }, []);

  const checkDemoStatus = async () => {
    try {
      // Check if demo mode is available
      const response = await fetch('/demo/dashboard');
      if (response.ok) {
        const data = await response.json();
        setIsDemoMode(data.isDemoMode);
        if (data.isDemoMode) {
          setDemoUsers(data.demoScenarios.users);
          setDemoChildren(data.demoScenarios.children);
          setDemoFeatures(data.demoScenarios.features);
        }
      }
    } catch (error) {
      console.log('Demo mode not available or not set up yet');
    } finally {
      setLoading(false);
    }
  };

  const setupDemoData = async () => {
    setShowSetup(true);
    try {
      const response = await fetch('/demo/setup', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        alert('Demo data setup complete! You can now log in with demo accounts.');
        checkDemoStatus(); // Refresh the demo status
      } else {
        alert(`Setup failed: ${result.message}`);
      }
    } catch (error) {
      alert('Failed to setup demo data. Please try again.');
    } finally {
      setShowSetup(false);
    }
  };

  const loginAsDemoUser = async (userEmail: string) => {
    try {
      const response = await fetch('/demo/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password: 'demo123' })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store demo token in localStorage
        localStorage.setItem('demo_token', result.user.token);
        localStorage.setItem('demo_user', JSON.stringify(result.user));
        
        // Find and set the current user
        const user = demoUsers.find(u => u.email === userEmail);
        setCurrentUser(user || null);
        
        alert(`Logged in as ${result.user.name} (${result.user.role})`);
        
        // Redirect to main app
        window.location.href = '/dashboard';
      } else {
        alert(`Login failed: ${result.message}`);
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const quickSwitchUser = async (userId: string) => {
    try {
      const response = await fetch('/demo/quick-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('demo_token', result.user.token);
        localStorage.setItem('demo_user', JSON.stringify(result.user));
        
        const user = demoUsers.find(u => u.id === userId);
        setCurrentUser(user || null);
        
        alert(`Switched to ${result.user.name} (${result.user.role})`);
        window.location.reload();
      }
    } catch (error) {
      alert('Quick switch failed. Please try again.');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Users className="h-5 w-5" />;
      case 'provider': return <Stethoscope className="h-5 w-5" />;
      case 'parent': return <Baby className="h-5 w-5" />;
      default: return <UserCheck className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'provider': return 'bg-blue-100 text-blue-800';
      case 'parent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading demo mode...</p>
        </div>
      </div>
    );
  }

  if (!isDemoMode) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            NeuroKinetics AI Demo Mode
          </CardTitle>
          <CardDescription>
            Experience all features with realistic demo data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              ⚠️ Demo mode is not currently enabled. Would you like to set up the demo environment?
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Demo Mode Includes:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>4 demo user accounts (Admin, Provider, 2 Parents)</li>
              <li>4 demo children with realistic profiles</li>
              <li>Completed screening sessions and assessments</li>
              <li>Sample intervention plans and progress tracking</li>
              <li>CareBuddy AI conversations</li>
              <li>Clinical protocols and education materials</li>
            </ul>
          </div>

          <Button 
            onClick={setupDemoData} 
            disabled={showSetup}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {showSetup ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Setting up demo data...
              </>
            ) : (
              'Setup Demo Environment'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Demo Mode Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8" />
              NeuroKinetics AI Demo Mode
            </h1>
            <p className="text-blue-100 mt-1">
              Experience all features with realistic demo data and easy user switching
            </p>
          </div>
          {currentUser && (
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm">Currently logged in as:</p>
              <p className="font-semibold">{currentUser.name}</p>
              <Badge variant="secondary" className="mt-1">{currentUser.role}</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>
            Follow these steps to explore the NeuroKinetics AI platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Demo Steps:</h3>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                  Choose a demo user role below
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                  Explore the dashboard and features
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                  Select a child profile to see their data
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                  Try CareBuddy AI for guidance
                </li>
              </ol>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Demo Tips:</h3>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li>• Use 'demo123' as password for all accounts</li>
                <li>• Each role has different permissions</li>
                <li>• Sample data includes realistic assessments</li>
                <li>• CareBuddy has pre-loaded conversations</li>
                <li>• Switch users to see different perspectives</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Demo User Accounts
          </CardTitle>
          <CardDescription>
            Click on any user to log in and experience their specific features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {demoUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Organization:</strong> {user.organization}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Children:</strong> {user.childrenCount} patients
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Last Activity:</strong> {user.recentActivity}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => loginAsDemoUser(user.email)}
                    className="flex-1"
                  >
                    Login as {user.name.split(' ')[0]}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => quickSwitchUser(user.id)}
                    disabled={currentUser?.id === user.id}
                  >
                    {currentUser?.id === user.id ? 'Current' : 'Switch'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Children */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5" />
            Demo Children Profiles
          </CardTitle>
          <CardDescription>
            Sample child patients with realistic assessment data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {demoChildren.map((child) => (
              <div key={child.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{child.name}</h3>
                    <p className="text-sm text-gray-600">
                      {child.age} years old • {child.sex === 'male' ? 'Boy' : 'Girl'}
                    </p>
                  </div>
                  <Badge 
                    variant={child.assessmentStatus === 'Assessment Complete' ? 'default' : 'secondary'}
                  >
                    {child.assessmentStatus}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Concerns:</strong> {child.primaryConcerns}
                  </p>
                  <div className="flex items-center gap-2">
                    {child.interventionPlan && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Has Intervention Plan
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      Last: {child.lastActivity}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    Assessment
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Available Features to Explore
          </CardTitle>
          <CardDescription>
            Click on any feature to see it in action with demo data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoFeatures.map((feature, index) => {
              const icons = [
                <Baby className="h-5 w-5" />,
                <Brain className="h-5 w-5" />,
                <FileText className="h-5 w-5" />,
                <MessageSquare className="h-5 w-5" />,
                <TrendingUp className="h-5 w-5" />,
                <Stethoscope className="h-5 w-5" />,
                <Users className="h-5 w-5" />,
                <UserCheck className="h-5 w-5" />
              ];
              
              return (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      {icons[index % icons.length]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{feature.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={feature.demoDataAvailable ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {feature.demoDataAvailable ? "Demo Ready" : "Coming Soon"}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Try It
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Demo Credentials Reminder */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <MessageSquare className="h-5 w-5" />
          <p className="font-medium">Demo Login Credentials</p>
        </div>
        <p className="text-blue-700 text-sm mt-2">
          <strong>Password for all accounts:</strong> demo123
        </p>
        <p className="text-blue-700 text-sm">
          <strong>Available accounts:</strong> admin@neurokinetics.demo, therapist@neurokinetics.demo, parent1@neurokinetics.demo, parent2@neurokinetics.demo
        </p>
      </div>
    </div>
  );
};

export default DemoMode;