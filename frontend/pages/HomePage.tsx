import { useNavigate } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Activity, Target, MessageSquare, Shield, Sparkles } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-8">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-16 w-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NeuroKinetics AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Clinical-grade autism screening and personalized intervention platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <Activity className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Gamified Screening</CardTitle>
              <CardDescription>
                6-10 minute camera-based assessment using interactive games and activities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-300 transition-colors">
            <CardHeader>
              <Target className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>
                Local AI models analyze behavioral patterns with 85%+ clinical accuracy
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-pink-300 transition-colors">
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-pink-600 mb-2" />
              <CardTitle>Personalized Intervention</CardTitle>
              <CardDescription>
                Evidence-based treatment plans with 24/7 AI copilot support
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-2xl">Clinical Validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">FDA-Grade Standards</h3>
                  <p className="text-sm text-muted-foreground">
                    Designed to meet Class II medical device requirements with HIPAA compliance
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Evidence-Based Approach</h3>
                  <p className="text-sm text-muted-foreground">
                    Validated against ADOS gold standard with morphokinetic biomarker detection
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" className="text-lg px-8 py-6">
                Sign In to Get Started
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="text-lg px-8 py-6"
            >
              Go to Dashboard
            </Button>
          </SignedIn>
          <p className="text-sm text-muted-foreground mt-4">
            This is a screening tool, not a diagnostic instrument. Professional evaluation recommended.
          </p>
        </div>
      </div>
    </div>
  );
}
