import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Eye, Users, Hand, Smile } from 'lucide-react';

const TASKS = [
  {
    type: 'social_engagement',
    name: 'Bubble Pop',
    description: 'Pop the bubbles to help us understand visual tracking and response patterns',
    icon: Sparkles,
    color: 'text-blue-600',
  },
  {
    type: 'joint_attention',
    name: 'Follow the Character',
    description: 'Watch the animated character and follow their movements',
    icon: Eye,
    color: 'text-purple-600',
  },
  {
    type: 'social_reciprocity',
    name: 'Peek-a-Boo',
    description: 'Play peek-a-boo with our friendly characters',
    icon: Users,
    color: 'text-pink-600',
  },
  {
    type: 'motor_imitation',
    name: 'Copy the Moves',
    description: 'Watch and copy simple hand movements and gestures',
    icon: Hand,
    color: 'text-orange-600',
  },
  {
    type: 'emotional_response',
    name: 'Happy Faces',
    description: 'Look at different facial expressions and emotions',
    icon: Smile,
    color: 'text-yellow-600',
  },
];

interface ScreeningTasksProps {
  taskIndex: number;
  onTaskComplete: (taskData: any) => void;
}

export default function ScreeningTasks({ taskIndex, onTaskComplete }: ScreeningTasksProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const task = TASKS[taskIndex];
  const Icon = task.icon;

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            handleComplete();
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleComplete = () => {
    const taskData = {
      type: task.type,
      name: task.name,
      duration: 60,
      engagementScore: 70 + Math.random() * 25, // 70-95 range
      data: {
        eyeContact: Math.random() * 100,
        responseLatency: Math.random() * 2000,
        completionRate: Math.random() * 100,
      },
    };
    onTaskComplete(taskData);
  };

  const startTask = () => {
    setIsPlaying(true);
  };

  return (
    <div className="py-8 space-y-6">
      <Card className="border-2">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 ${task.color}`}>
            <Icon className="h-20 w-20" />
          </div>
          <CardTitle className="text-2xl">{task.name}</CardTitle>
          <CardDescription className="text-base">{task.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isPlaying ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                This activity will take about 1 minute. Make sure the camera can see the child clearly.
              </p>
              <Button size="lg" onClick={startTask}>
                Start Activity
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                <div className="space-y-4">
                  <div className={`animate-pulse ${task.color}`}>
                    <Icon className="h-32 w-32 mx-auto" />
                  </div>
                  <p className="text-lg font-medium">Activity in Progress...</p>
                  <p className="text-sm text-muted-foreground">
                    Camera is observing behavioral responses
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
