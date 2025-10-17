import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface AssessmentAnimationProps {
  ageMonths: number;
  taskType: 'social' | 'motor' | 'attention' | 'sensory';
  onComplete?: () => void;
}

export default function AssessmentAnimation({ ageMonths, taskType, onComplete }: AssessmentAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const getAgeAppropriateContent = () => {
    if (ageMonths < 24) {
      switch (taskType) {
        case 'social':
          return {
            title: 'Peek-a-Boo Game',
            description: 'Watch the friendly character play peek-a-boo!',
            animation: 'peekaboo',
            duration: 30,
          };
        case 'motor':
          return {
            title: 'Follow the Ball',
            description: 'Follow the bouncing ball with your eyes',
            animation: 'ball-tracking',
            duration: 20,
          };
        case 'attention':
          return {
            title: 'Pop the Bubbles',
            description: 'Touch the colorful bubbles when they appear',
            animation: 'bubbles',
            duration: 25,
          };
        case 'sensory':
          return {
            title: 'Dancing Shapes',
            description: 'Watch the gentle shapes move and change colors',
            animation: 'shapes',
            duration: 30,
          };
      }
    } else if (ageMonths < 48) {
      switch (taskType) {
        case 'social':
          return {
            title: 'Emotion Match',
            description: 'Can you find the happy face?',
            animation: 'emotion-match',
            duration: 35,
          };
        case 'motor':
          return {
            title: 'Copy the Moves',
            description: 'Copy what the character does!',
            animation: 'movement-copy',
            duration: 40,
          };
        case 'attention':
          return {
            title: 'Find the Animal',
            description: 'Look for the hiding animals',
            animation: 'animal-search',
            duration: 35,
          };
        case 'sensory':
          return {
            title: 'Sound and Color',
            description: 'Watch and listen to the patterns',
            animation: 'audio-visual',
            duration: 30,
          };
      }
    } else {
      switch (taskType) {
        case 'social':
          return {
            title: 'Story Time',
            description: 'Watch the story and answer questions',
            animation: 'story-sequence',
            duration: 45,
          };
        case 'motor':
          return {
            title: 'Dance Challenge',
            description: 'Follow the dance moves!',
            animation: 'dance-sequence',
            duration: 50,
          };
        case 'attention':
          return {
            title: 'Pattern Detective',
            description: 'Find what comes next in the pattern',
            animation: 'pattern-game',
            duration: 40,
          };
        case 'sensory':
          return {
            title: 'Rhythm Match',
            description: 'Match the rhythm patterns',
            animation: 'rhythm-game',
            duration: 45,
          };
      }
    }
  };

  const content = getAgeAppropriateContent();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + (100 / content.duration);
          if (next >= 100) {
            setIsPlaying(false);
            onComplete?.();
            return 100;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, content.duration, onComplete]);

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const renderAnimation = () => {
    const animationClass = isPlaying ? 'animate-pulse' : '';
    
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {taskType === 'social' && (
            <div className={`w-32 h-32 rounded-full bg-yellow-400 ${animationClass}`}>
              <div className="relative w-full h-full">
                <div className="absolute top-8 left-6 w-4 h-4 rounded-full bg-black" />
                <div className="absolute top-8 right-6 w-4 h-4 rounded-full bg-black" />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full bg-black" />
              </div>
            </div>
          )}
          {taskType === 'motor' && (
            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-pink-500 shadow-2xl ${animationClass}`} 
                   style={{ transform: `translateY(${Math.sin(progress / 10) * 50}px)` }} />
            </div>
          )}
          {taskType === 'attention' && (
            <div className="grid grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`w-16 h-16 rounded-full ${animationClass}`}
                  style={{
                    backgroundColor: `hsl(${(i * 40 + progress * 3.6) % 360}, 70%, 60%)`,
                    opacity: isPlaying ? Math.random() * 0.5 + 0.5 : 0.3,
                  }}
                />
              ))}
            </div>
          )}
          {taskType === 'sensory' && (
            <div className="grid grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-20 h-20 ${animationClass}`}
                  style={{
                    backgroundColor: `hsl(${(i * 90 + progress * 2) % 360}, 60%, 70%)`,
                    borderRadius: i % 2 === 0 ? '50%' : '20%',
                    transform: `rotate(${progress * 3.6}deg)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20 dark:bg-black/20">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <Card className="p-8 border-0 bg-white dark:bg-gray-900 shadow-2xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{content.title}</h3>
          <p className="text-slate-600 dark:text-slate-300">{content.description}</p>
        </div>

        {renderAnimation()}

        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={progress >= 100}
            className="rounded-full px-8"
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                {progress > 0 ? 'Resume' : 'Start'}
              </>
            )}
          </Button>
          
          {progress > 0 && (
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              className="rounded-full"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          )}
        </div>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          Duration: {content.duration} seconds • Progress: {Math.round(progress)}%
        </div>
      </div>
    </Card>
  );
}
