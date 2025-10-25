import { useNavigate } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Activity, Target, MessageSquare, Shield, Sparkles, Users, Stethoscope, Lock } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-semibold text-foreground">
              NeuroKinetics AI
            </span>
          </div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-sm font-medium text-blue-700 dark:text-blue-300">
            <Sparkles className="h-4 w-4" />
            Clinical-Grade AI Assessment Platform
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            <span className="text-primary">
              Early Detection
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">Changes Lives</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Evidence-based autism screening and personalized intervention platform designed for families and healthcare providers
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="text-lg px-10 py-6 rounded-lg shadow-sm transition">
                  Get Started
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="text-lg px-10 py-6 rounded-lg shadow-sm transition"
              >
                Go to Dashboard
              </Button>
            </SignedIn>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-10 py-6 rounded-lg border"
              onClick={() => navigate('/demo')}
            >
              🎮 Try Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-10 py-6 rounded-lg border"
              onClick={() => document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border bg-card shadow-sm hover:shadow-md transition">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">For Parents</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-600 dark:text-slate-300">
              6-10 minute gamified screening with instant AI-powered insights and personalized intervention plans
            </CardContent>
          </Card>

          <Card className="border bg-card shadow-sm hover:shadow-md transition">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-600/10 dark:bg-purple-400/10 flex items-center justify-center mb-4">
                <Stethoscope className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">For Providers</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-600 dark:text-slate-300">
              Clinical-grade assessment tools with detailed analytics and evidence-based treatment recommendations
            </CardContent>
          </Card>

          <Card className="border bg-card shadow-sm hover:shadow-md transition">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-pink-600/10 dark:bg-pink-400/10 flex items-center justify-center mb-4">
                <Lock className="h-7 w-7 text-pink-600 dark:text-pink-400" />
              </div>
              <CardTitle className="text-xl">HIPAA Compliant</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-600 dark:text-slate-300">
              Enterprise-grade security with encrypted data storage and full regulatory compliance
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="science" className="bg-white dark:bg-gray-950 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              The Science Behind NeuroKinetics
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Built on decades of clinical research and validated against gold-standard diagnostic tools
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            <Card className="border-2 border-slate-200 dark:border-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Clinical Validation</CardTitle>
                    <p className="text-slate-600 dark:text-slate-300 text-base">
                      Our assessment protocol is validated against the ADOS-2 (Autism Diagnostic Observation Schedule), the gold standard in autism assessment. Studies demonstrate 85%+ concordance with clinical diagnoses when used as a screening tool.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-slate-200 dark:border-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Morphokinetic Biomarkers</CardTitle>
                    <p className="text-slate-600 dark:text-slate-300 text-base">
                      Using computer vision and machine learning, we analyze subtle motor patterns, eye gaze behaviors, and social reciprocity markers that correlate with ASD characteristics. Our algorithms detect micro-movements and behavioral patterns invisible to the naked eye.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-slate-200 dark:border-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Evidence-Based Interventions</CardTitle>
                    <p className="text-slate-600 dark:text-slate-300 text-base">
                      Our intervention protocols are based on Applied Behavior Analysis (ABA), Early Start Denver Model (ESDM), and other evidence-based practices recommended by the American Academy of Pediatrics and backed by peer-reviewed research.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-slate-200 dark:border-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">AI-Powered Support</CardTitle>
                    <p className="text-slate-600 dark:text-slate-300 text-base">
                      Our Care Buddy AI provides 24/7 personalized guidance based on current research, clinical guidelines, and your child's data. It helps parents implement interventions effectively and connects them with appropriate professional resources through evidence-based recommendations.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl md:text-4xl font-bold">
                Clinical Guidelines & Standards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Assessment Standards</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span>AAP developmental surveillance guidelines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span>CDC developmental milestone tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span>DSM-5 diagnostic criteria alignment</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Intervention Framework</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                      <span>Naturalistic developmental approaches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                      <span>Parent-mediated interventions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                      <span>Sensory integration strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  <strong>Important:</strong> This platform is a screening tool, not a diagnostic instrument. 
                  Professional evaluation by qualified clinicians is always recommended for definitive diagnosis and treatment planning.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-secondary dark:bg-gray-900 border-t border-border py-12">
        <div className="container mx-auto px-6 text-center text-slate-600 dark:text-slate-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-lg">NeuroKinetics AI</span>
          </div>
          <p className="text-sm">
            © 2025 NeuroKinetics AI. Clinical-grade autism assessment and intervention platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
