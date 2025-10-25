import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Play, RefreshCw, CheckCircle } from 'lucide-react';

interface DemoUser {
  id: string;
  email: string;
  role: 'admin' | 'provider' | 'parent';
  name: string;
}

interface DemoData {
  isDemoMode: boolean;
  users: DemoUser[];
  setupComplete: boolean;
}

export default function DemoPage() {
  const navigate = useNavigate();
  const [demoData, setDemoData] = useState<DemoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingUp, setSettingUp] = useState(false);

  useEffect(() => {
    fetchDemoData();
  }, []);

  const fetchDemoData = async () => {
    try {
      const response = await fetch('http://localhost:4000/demo/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDemoData(data);
      } else {
        console.error('Failed to fetch demo data');
      }
    } catch (error) {
      console.error('Error fetching demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupDemo = async () => {
    setSettingUp(true);
    try {
      const response = await fetch('http://localhost:4000/demo/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Demo setup completed:', result);
        // Refresh demo data
        fetchDemoData();
      } else {
        console.error('Demo setup failed');
      }
    } catch (error) {
      console.error('Error setting up demo:', error);
    } finally {
      setSettingUp(false);
    }
  };

  const handleLoginAsUser = (user: DemoUser) => {
    // In a real implementation, you would authenticate as this user
    // For demo purposes, we'll just navigate to the dashboard
    console.log('Logging in as:', user);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading demo data...</p>
        </div>
      </div>
    );
  }

  if (!demoData?.isDemoMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Demo Mode Not Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              Demo mode is not currently enabled. Please contact support if you believe this is an error.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle case where users array might be undefined
  const users = demoData?.users || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">NeuroKinetics AI Demo</h1>
          <p className="text-lg text-muted-foreground">
            Experience our clinical-grade autism screening platform
          </p>
          <Badge variant="outline" className="mt-4">
            Demo Mode Active
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Demo Setup Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Demo Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Set up demo data with sample users, assessments, and interventions to explore the platform.
              </p>
              <Button 
                onClick={handleSetupDemo} 
                disabled={settingUp || demoData.setupComplete}
                className="w-full"
              >
                {settingUp ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Setting Up...
                  </>
                ) : demoData.setupComplete ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Setup Complete
                  </>
                ) : (
                  'Setup Demo Data'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Demo Users Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Demo Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Explore the platform from different user perspectives.
              </p>
              <div className="space-y-2">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <Badge variant="secondary" className="mt-1">{user.role}</Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLoginAsUser(user)}
                      >
                        Login
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No demo users available. Click "Setup Demo Data" to create them.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Quick Demo Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate('/screening/demo')}
                >
                  🎮 Try Screening Game
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate('/carebuddy')}
                >
                  🤖 Chat with CareBuddy AI
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate('/knowledge')}
                >
                  📚 Explore Knowledge Library
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}