import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useBackend } from '@/lib/useBackend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import AssessmentAnimation from '@/components/AssessmentAnimation';

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

  const taskTypes: Array<'social' | 'motor' | 'attention' | 'sensory'> = [
    'social',
    'motor',
    'attention',
    'sensory',
    'social',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Screening Assessment
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">Child: {child.name}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Task {currentTaskIndex + 1} of 5</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {Math.round(progress)}%
                  </p>
                </div>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="py-20 text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-ping" />
                    </div>
                    <Loader2 className="h-20 w-20 animate-spin text-blue-600 dark:text-blue-400 mx-auto relative" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Analyzing Results...</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-lg">
                    Our AI is processing the assessment data
                  </p>
                </div>
              ) : (
                <AssessmentAnimation
                  ageMonths={child.ageMonths}
                  taskType={taskTypes[currentTaskIndex]}
                  onComplete={() => {
                    handleTaskComplete({
                      type: taskTypes[currentTaskIndex],
                      name: `Task ${currentTaskIndex + 1}`,
                      duration: 30,
                      engagementScore: 0.85,
                      data: {},
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
