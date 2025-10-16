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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Manage assessments and interventions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/copilot')} variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Copilot
            </Button>
            <Button onClick={() => setIsAddChildOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          </div>
        </div>

        {children.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Plus className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No children added yet</h3>
              <p className="text-muted-foreground mb-6">Add a child profile to get started</p>
              <Button onClick={() => setIsAddChildOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Child
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{child.name}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {Math.floor(child.ageMonths / 12)}y {child.ageMonths % 12}m
          </span>
        </CardTitle>
        <CardDescription>
          {child.sex} • {assessments.length} assessment{assessments.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {latestAssessment && (
          <div className="bg-muted rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Latest Assessment</span>
              <span className="font-medium">
                {latestAssessment.asdProbability.toFixed(1)}% ASD Probability
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/results/${latestAssessment.id}`)}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Report
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onStartScreening} size="sm">
            <Activity className="h-4 w-4 mr-2" />
            New Screening
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/intervention/${child.id}`)}
          >
            <Target className="h-4 w-4 mr-2" />
            Intervention
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
