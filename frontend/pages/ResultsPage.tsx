import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useBackend } from '@/lib/useBackend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileText, Target, ExternalLink, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ResultsPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const backend = useBackend();

  const { data: assessment } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: async () => backend.assessment.get({ id: Number(assessmentId) }),
    enabled: !!assessmentId,
  });

  const { data: report } = useQuery({
    queryKey: ['report', assessmentId],
    queryFn: async () => backend.report.get({ assessmentId: Number(assessmentId) }),
    enabled: !!assessmentId,
  });

  const { data: child } = useQuery({
    queryKey: ['child', assessment?.childId],
    queryFn: async () => backend.child.get({ id: assessment!.childId }),
    enabled: !!assessment?.childId,
  });

  if (!assessment || !report || !child) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const severityLabel = assessment.severityScore === 3 
    ? 'Requiring Very Substantial Support'
    : assessment.severityScore === 2
    ? 'Requiring Substantial Support'
    : 'Requiring Support';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Assessment Results</h1>
            <p className="text-muted-foreground">{child.name}</p>
          </div>
        </div>

        <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Screening Tool Notice</AlertTitle>
          <AlertDescription>
            This is a screening assessment, not a diagnostic tool. Professional evaluation is recommended for comprehensive diagnosis.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>ASD Probability</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {assessment.asdProbability.toFixed(1)}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Confidence: {assessment.confidenceLevel}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Severity Level</CardDescription>
              <CardTitle className="text-lg">Level {assessment.severityScore}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{severityLabel}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Recommendation</CardDescription>
              <CardTitle className="text-lg capitalize">
                {assessment.recommendation.replace(/_/g, ' ')}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clinical">Clinical Report</TabsTrigger>
            <TabsTrigger value="parent">Parent Summary</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Domain Scores</CardTitle>
                <CardDescription>Assessment across key developmental areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DomainScore
                  label="Social Communication"
                  score={assessment.socialCommunicationScore}
                />
                <DomainScore
                  label="Repetitive Behaviors"
                  score={assessment.repetitiveBehaviorsScore}
                />
                <DomainScore
                  label="Sensory Processing"
                  score={assessment.sensoryProcessingScore}
                />
                <DomainScore
                  label="Motor Coordination"
                  score={assessment.motorCoordinationScore}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Red Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {assessment.redFlags.map((flag, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-sm">{flag}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Observations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessment.keyObservations.map((obs, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-3">
                      <p className="text-sm font-medium">{obs.timestamp}</p>
                      <p className="text-sm text-muted-foreground">{obs.behavior}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => navigate(`/intervention/${child.id}`)}>
                <Target className="h-4 w-4 mr-2" />
                Create Intervention Plan
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="clinical">
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{report.executiveSummary}</p>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Detailed Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{report.detailedFindings}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parent">
            <Card>
              <CardHeader>
                <CardTitle>Parent-Friendly Summary</CardTitle>
                <CardDescription>Understanding your child's assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line leading-relaxed">{report.parentSummary}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <div className="space-y-4">
              {report.educationalResources.map((resource, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {resource.title}
                      <Button variant="ghost" size="sm" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface DomainScoreProps {
  label: string;
  score: number;
}

function DomainScore({ label, score }: DomainScoreProps) {
  const color = score < 40 ? 'bg-red-500' : score < 60 ? 'bg-yellow-500' : 'bg-green-500';
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{score.toFixed(1)}/100</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
