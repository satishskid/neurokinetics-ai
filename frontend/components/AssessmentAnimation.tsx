import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AssessmentAnimationProps {
  ageMonths: number;
  taskType: 'social' | 'motor' | 'attention' | 'sensory';
  onComplete?: () => void;
  // personalization options
  complexity?: 'basic' | 'standard' | 'advanced';
  pace?: 'slow' | 'normal' | 'fast';
  audioCues?: boolean;
  showInstructions?: boolean;
  durationOverride?: number;
  guidelineAnchor?: 'AAP' | 'IAP' | 'NIH' | 'WHO';
}

export default function AssessmentAnimation({ ageMonths, taskType, onComplete, complexity = 'standard', pace = 'normal', audioCues = false, showInstructions = true, durationOverride, guidelineAnchor = 'AAP' }: AssessmentAnimationProps) {
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
            instructions: 'Encourage eye contact and smiling during peek-a-boo.',
          };
        case 'motor':
          return {
            title: 'Follow the Ball',
            description: 'Follow the bouncing ball with your eyes',
            animation: 'ball-tracking',
            duration: 20,
            instructions: 'Track the ball visually; avoid pointing to prompt gaze following.',
          };
        case 'attention':
          return {
            title: 'Pop the Bubbles',
            description: 'Touch the colorful bubbles when they appear',
            animation: 'bubbles',
            duration: 25,
            instructions: 'Respond to visual stimuli; note latency and sustained attention.',
          };
        case 'sensory':
          return {
            title: 'Dancing Shapes',
            description: 'Watch the gentle shapes move and change colors',
            animation: 'shapes',
            duration: 30,
            instructions: 'Observe comfort with visual motion and color changes.',
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
            instructions: 'Identify facial expressions; observe labeling and matching accuracy.',
          };
        case 'motor':
          return {
            title: 'Copy the Moves',
            description: 'Copy what the character does!',
            animation: 'movement-copy',
            duration: 40,
            instructions: 'Imitate gross motor sequences; note coordination and timing.',
          };
        case 'attention':
          return {
            title: 'Find the Animal',
            description: 'Look for the hiding animals',
            animation: 'animal-search',
            duration: 35,
            instructions: 'Sustained attention and visual scanning; record search strategy.',
          };
        case 'sensory':
          return {
            title: 'Sound and Color',
            description: 'Watch and listen to the patterns',
            animation: 'audio-visual',
            duration: 30,
            instructions: 'Notice responses to rhythmic audio-visual patterns.',
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
            instructions: 'Narrative comprehension and social inference questions.',
          };
        case 'motor':
          return {
            title: 'Dance Challenge',
            description: 'Follow the dance moves!',
            animation: 'dance-sequence',
            duration: 50,
            instructions: 'Sequence imitation; note bilateral coordination and rhythm.',
          };
        case 'attention':
          return {
            title: 'Pattern Detective',
            description: 'Find what comes next in the pattern',
            animation: 'pattern-game',
            duration: 40,
            instructions: 'Working memory and selective attention to sequences.',
          };
        case 'sensory':
          return {
            title: 'Rhythm Match',
            description: 'Match the rhythm patterns',
            animation: 'rhythm-game',
            duration: 45,
            instructions: 'Auditory processing and rhythm matching.',
          };
      }
    }
  };

  const content = getAgeAppropriateContent();

  const paceFactor = pace === 'slow' ? 1.3 : pace === 'fast' ? 0.7 : 1;
  const effectiveDuration = Math.max(10, Math.round((durationOverride ?? content.duration) * paceFactor));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + (100 / effectiveDuration);
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
  }, [isPlaying, progress, effectiveDuration, onComplete]);

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const renderAnimation = () => {
    const animationClass = isPlaying ? 'animate-pulse' : '';
    const attentionCount = complexity === 'basic' ? 6 : complexity === 'advanced' ? 12 : 9;
    const sensoryCount = complexity === 'basic' ? 3 : complexity === 'advanced' ? 6 : 4;

    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 rounded-3xl overflow-hidden">
        {showInstructions && (
          <div className="absolute top-4 left-4 bg-white/70 dark:bg-black/50 backdrop-blur-md rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-200 shadow">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Guidance</span>
              {audioCues && <Volume2 className="h-3.5 w-3.5" />}
            </div>
            <p className="mt-1">{content.instructions}</p>
          </div>
        )}
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
                   style={{ transform: `translateY(${Math.sin(progress / 10) * (complexity === 'advanced' ? 70 : complexity === 'basic' ? 30 : 50)}px)` }} />
            </div>
          )}
          {taskType === 'attention' && (
            <div className="grid grid-cols-3 gap-6">
              {[...Array(attentionCount)].map((_, i) => (
                <div
                  key={i}
                  className={`w-16 h-16 rounded-full ${animationClass}`}
                  style={{
                    backgroundColor: `hsl(${(i * 40 + progress * (pace === 'fast' ? 5 : pace === 'slow' ? 2 : 3.6)) % 360}, 70%, 60%)`,
                    opacity: isPlaying ? Math.random() * 0.5 + 0.5 : 0.3,
                  }}
                />
              ))}
            </div>
          )}
          {taskType === 'sensory' && (
            <div className="grid grid-cols-2 gap-8">
              {[...Array(sensoryCount)].map((_, i) => (
                <div
                  key={i}
                  className={`w-20 h-20 ${animationClass}`}
                  style={{
                    backgroundColor: `hsl(${(i * 90 + progress * (pace === 'fast' ? 3 : pace === 'slow' ? 1.5 : 2)) % 360}, 60%, 70%)`,
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
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">Guideline: {guidelineAnchor}</Badge>
            <Badge variant="outline">Aligned: AAP • IAP • NIH</Badge>
          </div>
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
          Duration: {effectiveDuration} seconds • Progress: {Math.round(progress)}%
        </div>
      </div>
    </Card>
  );
}
