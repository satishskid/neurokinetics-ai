import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useBackend } from '@/lib/useBackend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Activity, FileText, Target, MessageSquare, ArrowLeft } from 'lucide-react';
import AddChildDialog from '@/components/AddChildDialog';

export default function DashboardPage() {
  const navigate = useNavigate();
  const backend = useBackend();
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);

  const { data: childrenData, refetch } = useQuery({
    queryKey: ['children'],
    queryFn: async () => backend.child.list(),
  });

  const children = childrenData?.children || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="border-b border-slate-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Parent Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Manage assessments and interventions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/knowledge')} variant="outline" className="rounded-full">
                <FileText className="h-4 w-4 mr-2" />
                Resources
              </Button>
              <Button onClick={() => navigate('/carebuddy')} variant="outline" className="rounded-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Care Buddy
              </Button>
              <Button onClick={() => setIsAddChildOpen(true)} className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Child
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-12">

        {children.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-300 dark:border-gray-700 shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                <Plus className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">No children added yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">Add a child profile to get started with screening</p>
              <Button onClick={() => setIsAddChildOpen(true)} size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Child
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {children.map((child) => (
              <ChildCard 
                key={child.id} 
                child={child}
                onStartScreening={() => navigate(`/screening/${child.id}`)}
              />
            ))}
          </div>
        )}

        <AddChildDialog
          open={isAddChildOpen}
          onOpenChange={setIsAddChildOpen}
          onSuccess={() => {
            refetch();
            setIsAddChildOpen(false);
          }}
        />
      </div>
    </div>
  );
}

interface ChildCardProps {
  child: {
    id: number;
    name: string;
    ageMonths: number;
    sex: string;
    developmentalConcerns?: string;
  };
  onStartScreening: () => void;
}

function ChildCard({ child, onStartScreening }: ChildCardProps) {
  const navigate = useNavigate();
  const backend = useBackend();
  
  const { data: assessmentsData } = useQuery({
    queryKey: ['assessments', child.id],
    queryFn: async () => backend.assessment.listByChild({ childId: child.id }),
  });

  const assessments = assessmentsData?.assessments || [];
  const latestAssessment = assessments[0];

  return (
    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all bg-white dark:bg-gray-900 overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {child.name.charAt(0)}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{child.name}</CardTitle>
            <CardDescription className="text-sm">
              {Math.floor(child.ageMonths / 12)}y {child.ageMonths % 12}m • {child.sex}
            </CardDescription>
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {assessments.length} assessment{assessments.length !== 1 ? 's' : ''} completed
        </div>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        {latestAssessment && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-4 space-y-3 border border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Latest Assessment</span>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {latestAssessment.asdProbability.toFixed(1)}%
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/results/${latestAssessment.id}`)}
              className="w-full rounded-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Report
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={onStartScreening} size="sm" className="rounded-full">
            <Activity className="h-4 w-4 mr-2" />
            Screen
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/intervention/${child.id}`)}
            className="rounded-full"
          >
            <Target className="h-4 w-4 mr-2" />
            Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
