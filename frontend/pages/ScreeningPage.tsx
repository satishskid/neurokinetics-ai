import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useBackend } from '@/lib/useBackend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import ScreeningTasks from '@/components/ScreeningTasks';

export default function ScreeningPage() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: child } = useQuery({
    queryKey: ['child', childId],
    queryFn: async () => backend.child.get({ id: Number(childId) }),
    enabled: !!childId,
  });

  const startMutation = useMutation({
    mutationFn: async () => 
      backend.screening.start({ childId: Number(childId) }),
    onSuccess: (data) => {
      setSessionId(data.id);
    },
    onError: (error) => {
      console.error('Failed to start screening:', error);
      toast({
        title: 'Error',
        description: 'Failed to start screening session',
        variant: 'destructive',
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => backend.screening.complete({ sessionId: sessionId! }),
    onSuccess: async (data) => {
      // Generate report
      await backend.report.generate({ assessmentId: data.assessmentId });
      navigate(`/results/${data.assessmentId}`);
    },
    onError: (error) => {
      console.error('Failed to complete screening:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete screening',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (childId && !sessionId) {
      startMutation.mutate();
    }
  }, [childId]);

  const handleTaskComplete = async (taskData: any) => {
    if (!sessionId) return;

    try {
      await backend.screening.submitTask({
        sessionId,
        taskType: taskData.type,
        taskName: taskData.name,
        durationSeconds: taskData.duration,
        engagementScore: taskData.engagementScore,
        rawData: taskData.data,
      });

      if (currentTaskIndex < 4) {
        setCurrentTaskIndex(currentTaskIndex + 1);
      } else {
        setIsAnalyzing(true);
        completeMutation.mutate();
      }
    } catch (error) {
      console.error('Failed to submit task:', error);
      toast({
        title: 'Error',
        description: 'Failed to save task data',
        variant: 'destructive',
      });
    }
  };

  if (!child || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const progress = ((currentTaskIndex + 1) / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-2xl">Screening Assessment</CardTitle>
                <CardDescription>Child: {child.name}</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Task {currentTaskIndex + 1} of 5</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="py-16 text-center space-y-4">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
                <h3 className="text-xl font-semibold">Analyzing Results...</h3>
                <p className="text-muted-foreground">
                  Our AI is processing the assessment data
                </p>
              </div>
            ) : (
              <ScreeningTasks
                taskIndex={currentTaskIndex}
                onTaskComplete={handleTaskComplete}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
