import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackend } from '@/lib/useBackend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  Clock,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';

export default function ProviderDashboard() {
  const backend = useBackend();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeInterventions: 0,
    pendingReviews: 0,
    completedAssessments: 0,
  });

  const mockPatients = [
    {
      id: 1,
      name: 'Emma Thompson',
      age: 36,
      lastAssessment: '2025-10-10',
      riskLevel: 'medium',
      status: 'active',
    },
    {
      id: 2,
      name: 'Liam Rodriguez',
      age: 28,
      lastAssessment: '2025-10-12',
      riskLevel: 'high',
      status: 'pending-review',
    },
    {
      id: 3,
      name: 'Sophia Chen',
      age: 44,
      lastAssessment: '2025-10-15',
      riskLevel: 'low',
      status: 'active',
    },
  ];

  const interventionSummaries = [
    {
      category: 'Social Communication',
      activeCount: 12,
      avgProgress: 78,
      trend: 'up',
    },
    {
      category: 'Repetitive Behaviors',
      activeCount: 8,
      avgProgress: 65,
      trend: 'up',
    },
    {
      category: 'Sensory Processing',
      activeCount: 15,
      avgProgress: 72,
      trend: 'stable',
    },
    {
      category: 'Motor Skills',
      activeCount: 10,
      avgProgress: 82,
      trend: 'up',
    },
  ];

  useEffect(() => {
    setStats({
      totalPatients: 24,
      activeInterventions: 45,
      pendingReviews: 7,
      completedAssessments: 156,
    });
  }, []);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Low Risk</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Active</Badge>;
      case 'pending-review':
        return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">Pending Review</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Provider Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Clinical overview and intervention management</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/knowledge')} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Clinical Library
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                Switch to Parent View
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Patients</CardTitle>
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalPatients}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active in your care</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Interventions</CardTitle>
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeInterventions}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ongoing treatment plans</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Reviews</CardTitle>
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.pendingReviews}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Require attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed Assessments</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.completedAssessments}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This quarter</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="interventions">Intervention Tools</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Overview of patients requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-gray-900 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{patient.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Age: {patient.age} months</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right mr-4">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Last Assessment</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{patient.lastAssessment}</p>
                        </div>
                        {getRiskBadge(patient.riskLevel)}
                        {getStatusBadge(patient.status)}
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Intervention Tools Summary</CardTitle>
                <CardDescription>Evidence-based intervention categories and progress tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {interventionSummaries.map((intervention, idx) => (
                    <Card key={idx} className="border-2 border-slate-200 dark:border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{intervention.category}</CardTitle>
                          {intervention.trend === 'up' ? (
                            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Active Plans</span>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">{intervention.activeCount}</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Avg Progress</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{intervention.avgProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                              style={{ width: `${intervention.avgProgress}%` }}
                            />
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          View Protocols
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Clinical Guidelines</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                        All intervention protocols are based on evidence-based practices including ABA, ESDM, and naturalistic developmental behavioral interventions (NDBI).
                      </p>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                        <li>• Individualized treatment planning based on assessment results</li>
                        <li>• Parent-mediated intervention strategies</li>
                        <li>• Progress monitoring with data-driven adjustments</li>
                        <li>• Collaboration tools for multidisciplinary teams</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Clinical Analytics</CardTitle>
                <CardDescription>Performance metrics and outcome tracking</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-slate-500 dark:text-slate-400">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon</p>
                  <p className="text-sm mt-2">Track patient outcomes, intervention efficacy, and clinical metrics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
