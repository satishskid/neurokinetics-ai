import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useBackend } from '@/lib/useBackend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Target, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
// Added imports for assistant and resources UI
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import client from '@/client';

export default function InterventionPage() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  // Assistant state
  const [searchQuery, setSearchQuery] = useState('');
  const [protocolCategory, setProtocolCategory] = useState<string>('general');

  const { data: child } = useQuery({
    queryKey: ['child', childId],
    queryFn: async () => backend.child.get({ id: Number(childId) }),
    enabled: !!childId,
  });

  const { data: assessmentsData } = useQuery({
    queryKey: ['assessments', childId],
    queryFn: async () => backend.assessment.listByChild({ childId: Number(childId) }),
    enabled: !!childId,
  });

  const latestAssessment = assessmentsData?.assessments[0];

  // Detailed assessment to power interpretation
  const { data: assessmentDetail } = useQuery({
    queryKey: ['assessmentDetail', latestAssessment?.id],
    queryFn: async () => backend.assessment.get({ id: latestAssessment!.id }),
    enabled: !!latestAssessment?.id,
  });

  const { data: plan, isLoading: planLoading, refetch } = useQuery({
    queryKey: ['intervention', childId],
    queryFn: async () => backend.intervention.get({ childId: Number(childId) }),
    enabled: !!childId,
  });

  const createPlanMutation = useMutation({
    mutationFn: async () => 
      backend.intervention.create({
        childId: Number(childId),
        assessmentId: latestAssessment!.id,
      }),
    onSuccess: () => {
      refetch();
      toast({
        title: 'Success',
        description: 'Intervention plan created successfully',
      });
    },
    onError: (error) => {
      console.error('Failed to create plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to create intervention plan',
        variant: 'destructive',
      });
    },
  });

  const recordProgressMutation = useMutation({
    mutationFn: async (goalId: string) =>
      backend.intervention.addProgress({
        interventionPlanId: plan!.id,
        childId: Number(childId),
        entryDate: new Date(),
        goalId,
        activityCompleted: true,
      }),
    onSuccess: () => {
      toast({
        title: 'Progress Recorded',
        description: 'Activity completion logged successfully',
      });
    },
  });

  const handleActivityToggle = (goalId: string, checked: boolean) => {
    const newSet = new Set(completedActivities);
    if (checked) {
      newSet.add(goalId);
      recordProgressMutation.mutate(goalId);
    } else {
      newSet.delete(goalId);
    }
    setCompletedActivities(newSet);
  };

  // Current user role for education access
  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: async () => backend.user.getMe(),
  });

  const eduEnabled = me?.role === 'parent' || me?.role === 'admin';

  // Default query seeded from recommendations
  const defaultQuery = (() => {
    const rec = assessmentDetail?.recommendation || latestAssessment?.recommendation;
    return rec ? rec.slice(0, 80) : 'ASD early intervention';
  })();

  // Knowledge: clinical protocols (providers/doctors)
  const { data: protocolsData, isFetching: loadingProtocols } = useQuery({
    queryKey: ['knowledgeProtocols', searchQuery, protocolCategory],
    queryFn: async () => client.knowledge.searchProtocols({
      query: (searchQuery?.trim() || defaultQuery),
      category: protocolCategory !== 'general' ? protocolCategory : undefined,
      limit: 6,
    }),
    enabled: !!latestAssessment?.id,
  });

  // Knowledge: patient education (parents)
  const { data: educationData, isFetching: loadingEducation } = useQuery({
    queryKey: ['knowledgeEducation', searchQuery, protocolCategory],
    queryFn: async () => client.knowledge.searchEducation({
      query: (searchQuery?.trim() || defaultQuery),
      category: protocolCategory !== 'general' ? protocolCategory : undefined,
      limit: 6,
    }),
    enabled: !!latestAssessment?.id && !!eduEnabled,
  });

  if (!child) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Intervention Plan</h1>
              <p className="text-muted-foreground">{child.name}</p>
            </div>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center space-y-4">
              <Target className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold">No Intervention Plan Yet</h3>
              <p className="text-muted-foreground">
                {latestAssessment 
                  ? 'Create a personalized intervention plan based on the latest assessment'
                  : 'Complete a screening assessment first to create an intervention plan'}
              </p>
              {latestAssessment && (
                <Button onClick={() => createPlanMutation.mutate()}>
                  Create Intervention Plan
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Helper: severity label
  const severityScore = assessmentDetail?.severityScore ?? latestAssessment?.severityScore ?? 0;
  const severityLabel = severityScore >= 0.7 ? 'High' : severityScore >= 0.4 ? 'Moderate' : 'Low';
  const asdProb = (assessmentDetail?.asdProbability ?? latestAssessment?.asdProbability ?? 0) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Intervention Plan</h1>
            <p className="text-muted-foreground">{child.name}</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Priority Goals</CardTitle>
              <CardDescription>Evidence-based SMART goals for your child</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.priorityGoals.map((goal: { id: string; goal: string; rationale: string; timeline: string; measurable: string }) => (
                <div key={goal.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold">{goal.goal}</h4>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {goal.timeline}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{goal.rationale}</p>
                  <p className="text-sm">
                    <span className="font-medium">Measurable:</span> {goal.measurable}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Schedule</CardTitle>
              <CardDescription>Structured activities for consistent intervention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.dailySchedule.map((activity: { time: string; activity: string; duration: number }, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={completedActivities.has(`activity-${index}`)}
                      onCheckedChange={(checked) => 
                        handleActivityToggle(`activity-${index}`, checked as boolean)
                      }
                    />
                    <div>
                      <p className="font-medium">{activity.activity}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.duration} min</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intervention Strategies</CardTitle>
              <CardDescription>Evidence-based techniques by domain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(Object.entries(plan.interventionStrategies as Record<string, string[]>) as [string, string[]][]).map(([domain, strategies]) => (
                <div key={domain}>
                  <h4 className="font-semibold mb-3 capitalize">
                    {domain.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <ul className="space-y-2">
                    {strategies.map((strategy: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Interpretation Assistant & Knowledge resources */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Interpretation Assistant</CardTitle>
                  <CardDescription>Guidance aligned with AAP • IAP • NIH</CardDescription>
                </div>
                <Badge variant="outline">Standards: AAP/IAP/NIH</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">ASD Probability</p>
                  <p className="text-2xl font-bold">{Math.round(asdProb)}%</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {severityLabel}
                    <Badge variant={severityLabel === 'High' ? 'destructive' : severityLabel === 'Moderate' ? 'secondary' : 'outline'}>
                      {severityScore.toFixed(2)}
                    </Badge>
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Red Flags</p>
                  <p className="text-2xl font-bold">{assessmentDetail?.redFlags?.length ?? 0}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Interpretation Path</h4>
                <ul className="space-y-2 text-sm">
                  {severityLabel === 'High' && (
                    <>
                      <li>• Immediate referral to developmental pediatrician and multidisciplinary team.</li>
                      <li>• Schedule standardized evaluation (e.g., ADOS-2) and audiology screening.</li>
                      <li>• Initiate early intervention services and caregiver coaching.</li>
                    </>
                  )}
                  {severityLabel === 'Moderate' && (
                    <>
                      <li>• Targeted therapies (speech-language, occupational therapy) based on domain scores.</li>
                      <li>• Parent-mediated intervention (PMIs) and home routines.</li>
                      <li>• Monitor progress with monthly follow-up and structured goals.</li>
                    </>
                  )}
                  {severityLabel === 'Low' && (
                    <>
                      <li>• Focus on social communication enrichment and play-based routines.</li>
                      <li>• Provide caregiver education and developmental stimulation guidance.</li>
                      <li>• Reassess if red flags persist or new concerns emerge.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Knowledge search controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Domain/Category</Label>
                  <Select value={protocolCategory} onValueChange={(v) => setProtocolCategory(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="social-communication">Social Communication</SelectItem>
                      <SelectItem value="sensory-processing">Sensory Processing</SelectItem>
                      <SelectItem value="motor-coordination">Motor Coordination</SelectItem>
                      <SelectItem value="attention">Attention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Search</Label>
                  <Input 
                    placeholder="Search protocols and education (e.g., early social communication)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="protocols" className="mt-2">
                <TabsList>
                  <TabsTrigger value="protocols">Protocols</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                </TabsList>
                <TabsContent value="protocols" className="pt-4">
                  {loadingProtocols ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading protocols...</div>
                  ) : protocolsData?.protocols?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {protocolsData.protocols.map((p: { id: number; title: string; category: string; content: string; evidenceLevel: string; lastUpdated: string }) => (
                        <div key={p.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold">{p.title}</h5>
                            <Badge variant="outline" className="capitalize">{p.evidenceLevel}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Category: {p.category}</p>
                          <p className="text-sm line-clamp-3">{p.content}</p>
                          <p className="text-xs text-muted-foreground">Updated: {new Date(p.lastUpdated).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No protocol results. Try refining your query.</p>
                  )}
                </TabsContent>
                <TabsContent value="education" className="pt-4">
                  {!eduEnabled ? (
                    <p className="text-sm text-muted-foreground">Education resources require parent/admin access.</p>
                  ) : loadingEducation ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading education...</div>
                  ) : educationData?.resources?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {educationData.resources.map((r: { id: number; title: string; category: string; content: string; lastUpdated: string }) => (
                        <div key={r.id} className="border rounded-lg p-4 space-y-2">
                          <h5 className="font-semibold">{r.title}</h5>
                          <p className="text-xs text-muted-foreground">Category: {r.category}</p>
                          <p className="text-sm line-clamp-3">{r.content}</p>
                          <p className="text-xs text-muted-foreground">Updated: {new Date(r.lastUpdated).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No education results. Adjust filters or search terms.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
