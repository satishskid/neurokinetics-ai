import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useBackend } from '@/lib/useBackend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Target, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

export default function InterventionPage() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());

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
        userId: DEMO_USER_ID,
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
              {plan.priorityGoals.map((goal) => (
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
              {plan.dailySchedule.map((activity, index) => (
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
              {Object.entries(plan.interventionStrategies).map(([domain, strategies]) => (
                <div key={domain}>
                  <h4 className="font-semibold mb-3 capitalize">
                    {domain.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <ul className="space-y-2">
                    {strategies.map((strategy, index) => (
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
        </div>
      </div>
    </div>
  );
}
