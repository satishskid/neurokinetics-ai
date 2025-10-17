import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackend } from '@/lib/useBackend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, FileText, BookOpen, ExternalLink } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export default function KnowledgeLibraryPage() {
  const navigate = useNavigate();
  const backend = useBackend();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();
  const [role, setRole] = useState<string | undefined>();
  const [showEduForm, setShowEduForm] = useState(false);
  const [showProtocolForm, setShowProtocolForm] = useState(false);
  const [edu, setEdu] = useState({
    title: '',
    category: '',
    content: '',
    ageRange: '',
    keywordsText: '',
    references: [{ title: '', source: '', url: '' }],
  });
  const [protocol, setProtocol] = useState({
    title: '',
    category: '',
    content: '',
    evidenceLevel: '',
    keywordsText: '',
    references: [{ title: '', authors: '', journal: '', year: '', doi: '' }],
  });

  useEffect(() => {
    (async () => {
      try {
        const me = await backend.user.getMe();
        setRole(me.role);
      } catch (_) {
        // ignore
      }
    })();
  }, [backend]);
  const categories = {
    protocols: [
      'Assessment & Diagnosis',
      'Behavioral Interventions',
      'Speech & Language',
      'Occupational Therapy',
      'Pharmacological Treatments',
      'Co-occurring Conditions',
    ],
    education: [
      'Understanding Autism',
      'Daily Care & Routines',
      'Communication Strategies',
      'Sensory Processing',
      'Social Skills',
      'School & Education',
    ],
  };

  const handleSearch = async (category: 'protocols' | 'education') => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      if (category === 'protocols') {
        const result = await backend.knowledge.searchProtocols({ query: searchQuery, limit: 20 });
        setSearchResults(result.protocols || []);
      } else {
        const result = await backend.knowledge.searchEducation({ query: searchQuery, limit: 20 });
        setSearchResults(result.resources || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const updateEduRef = (idx: number, field: 'title'|'source'|'url', value: string) => {
    const refs = [...edu.references];
    refs[idx] = { ...refs[idx], [field]: value };
    setEdu({ ...edu, references: refs });
  };

  const updateProtocolRef = (idx: number, field: 'title'|'authors'|'journal'|'year'|'doi', value: string) => {
    const refs = [...protocol.references];
    refs[idx] = { ...refs[idx], [field]: value };
    setProtocol({ ...protocol, references: refs });
  };

  const handleUpsertEducation = async () => {
    try {
      const references = edu.references
        .filter(r => r.title || r.source || r.url)
        .map(r => ({ title: r.title, source: r.source, url: r.url || undefined }));
      const keywords = edu.keywordsText.split(',').map(s => s.trim()).filter(Boolean);
      await backend.knowledge.upsertEducation({
        title: edu.title,
        category: edu.category,
        content: edu.content,
        ageRange: edu.ageRange || undefined,
        references: references.length ? references : undefined,
        keywords: keywords.length ? keywords : undefined,
      });
      toast({ title: 'Education resource saved' });
      setEdu({ title: '', category: '', content: '', ageRange: '', keywordsText: '', references: [{ title: '', source: '', url: '' }] });
      setShowEduForm(false);
      handleSearch('education');
    } catch (err: any) {
      toast({ title: 'Failed to save education resource', description: err?.message, variant: 'destructive' });
    }
  };

  const handleUpsertProtocol = async () => {
    try {
      const references = protocol.references
        .filter(r => r.title || r.authors || r.journal || r.year || r.doi)
        .map(r => ({ title: r.title, authors: r.authors, journal: r.journal, year: Number(r.year) || undefined, doi: r.doi || undefined }));
      const keywords = protocol.keywordsText.split(',').map(s => s.trim()).filter(Boolean);
      await backend.knowledge.upsertProtocol({
        title: protocol.title,
        category: protocol.category,
        content: protocol.content,
        evidenceLevel: protocol.evidenceLevel || undefined,
        references: references.length ? references : undefined,
        keywords: keywords.length ? keywords : undefined,
      });
      toast({ title: 'Protocol saved' });
      setProtocol({ title: '', category: '', content: '', evidenceLevel: '', keywordsText: '', references: [{ title: '', authors: '', journal: '', year: '', doi: '' }] });
      setShowProtocolForm(false);
      handleSearch('protocols');
    } catch (err: any) {
      toast({ title: 'Failed to save protocol', description: err?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="border-b border-slate-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Knowledge Library
              </h1>
              <p className="text-slate-600 dark:text-slate-400">Evidence-based resources and clinical protocols</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="education" className="space-y-8">
          <TabsList className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-1">
            <TabsTrigger value="education" className="rounded-lg">
              <BookOpen className="h-4 w-4 mr-2" />
              Parent Education
            </TabsTrigger>
            <TabsTrigger value="protocols" className="rounded-lg">
              <FileText className="h-4 w-4 mr-2" />
              Clinical Protocols
            </TabsTrigger>
          </TabsList>

          <TabsContent value="education" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Patient Education Library</CardTitle>
                <CardDescription>
                  Trusted, evidence-based resources to help you understand and support your child with autism
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Search for topics, strategies, or resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch('education')}
                    className="rounded-full"
                  />
                  <Button 
                    onClick={() => handleSearch('education')} 
                    disabled={isSearching}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Browse by Category</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {categories.education.map((cat) => (
                      <Button
                        key={cat}
                        variant="outline"
                        className="justify-start h-auto py-4 rounded-xl"
                        onClick={() => {
                          setSearchQuery(cat);
                          handleSearch('education');
                        }}
                      >
                        <div className="text-left">
                          <p className="font-medium">{cat}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Learn more
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {(role === 'admin' || role === 'provider' || role === 'doctor') && (
                  <div className="space-y-4 border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Add or Update Education Resource</h3>
                      <Button variant="outline" onClick={() => setShowEduForm(v => !v)}>
                        {showEduForm ? 'Hide Form' : 'Show Form'}
                      </Button>
                    </div>
                    {showEduForm && (
                      <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Title</Label>
                            <Input value={edu.title} onChange={(e) => setEdu({ ...edu, title: e.target.value })} />
                          </div>
                          <div>
                            <Label>Category</Label>
                            <Select value={edu.category} onValueChange={(v) => setEdu({ ...edu, category: v })}>
                              <SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
                              <SelectContent>
                                {categories.education.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <Label>Content</Label>
                            <Textarea rows={6} value={edu.content} onChange={(e) => setEdu({ ...edu, content: e.target.value })} />
                          </div>
                          <div>
                            <Label>Age Range</Label>
                            <Input value={edu.ageRange} onChange={(e) => setEdu({ ...edu, ageRange: e.target.value })} />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Keywords (comma-separated)</Label>
                            <Input value={edu.keywordsText} onChange={(e) => setEdu({ ...edu, keywordsText: e.target.value })} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>References</Label>
                          {edu.references.map((ref, idx) => (
                            <div key={idx} className="grid md:grid-cols-3 gap-3">
                              <Input placeholder="Title" value={ref.title} onChange={(e) => updateEduRef(idx, 'title', e.target.value)} />
                              <Input placeholder="Source" value={ref.source} onChange={(e) => updateEduRef(idx, 'source', e.target.value)} />
                              <Input placeholder="URL (optional)" value={ref.url} onChange={(e) => updateEduRef(idx, 'url', e.target.value)} />
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setEdu({ ...edu, references: [...edu.references, { title: '', source: '', url: '' }] })}>Add Reference</Button>
                            <Button onClick={handleUpsertEducation}>Save Resource</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Search Results</h3>
                    <div className="space-y-3">
                      {searchResults.map((resource: any) => (
                        <Card key={resource.id} className="border-2 border-slate-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{resource.title}</CardTitle>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline">{resource.category}</Badge>
                                  {resource.ageRange && <Badge variant="outline">{resource.ageRange}</Badge>}
                                  {resource.difficultyLevel && (
                                    <Badge className={
                                      resource.difficultyLevel === 'beginner' ? 'bg-green-100 text-green-700' :
                                      resource.difficultyLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-orange-100 text-orange-700'
                                    }>
                                      {resource.difficultyLevel}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                              {resource.content}
                            </p>
                            {resource.references && resource.references.length > 0 && (
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                <p className="font-semibold mb-1">Sources:</p>
                                {resource.references.slice(0, 2).map((ref: any, idx: number) => (
                                  <p key={idx}>• {ref.title} — {ref.source}</p>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="protocols" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Clinical Protocols Library</CardTitle>
                <CardDescription>
                  Evidence-based clinical guidelines and treatment protocols for healthcare providers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Search protocols, interventions, or guidelines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch('protocols')}
                    className="rounded-full"
                  />
                  <Button 
                    onClick={() => handleSearch('protocols')} 
                    disabled={isSearching}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Browse by Category</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {categories.protocols.map((cat) => (
                      <Button
                        key={cat}
                        variant="outline"
                        className="justify-start h-auto py-4 rounded-xl"
                        onClick={() => {
                          setSearchQuery(cat);
                          handleSearch('protocols');
                        }}
                      >
                        <div className="text-left">
                          <p className="font-medium">{cat}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            View protocols
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {(role === 'admin' || role === 'provider' || role === 'doctor') && (
                  <div className="space-y-4 border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Add or Update Clinical Protocol</h3>
                      <Button variant="outline" onClick={() => setShowProtocolForm(v => !v)}>
                        {showProtocolForm ? 'Hide Form' : 'Show Form'}
                      </Button>
                    </div>
                    {showProtocolForm && (
                      <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Title</Label>
                            <Input value={protocol.title} onChange={(e) => setProtocol({ ...protocol, title: e.target.value })} />
                          </div>
                          <div>
                            <Label>Category</Label>
                            <Select value={protocol.category} onValueChange={(v) => setProtocol({ ...protocol, category: v })}>
                              <SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
                              <SelectContent>
                                {categories.protocols.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <Label>Content</Label>
                            <Textarea rows={6} value={protocol.content} onChange={(e) => setProtocol({ ...protocol, content: e.target.value })} />
                          </div>
                          <div>
                            <Label>Evidence Level</Label>
                            <Select value={protocol.evidenceLevel} onValueChange={(v) => setProtocol({ ...protocol, evidenceLevel: v })}>
                              <SelectTrigger className="w-full"><SelectValue placeholder="Select level" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <Label>Keywords (comma-separated)</Label>
                            <Input value={protocol.keywordsText} onChange={(e) => setProtocol({ ...protocol, keywordsText: e.target.value })} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>References</Label>
                          {protocol.references.map((ref, idx) => (
                            <div key={idx} className="grid md:grid-cols-5 gap-3">
                              <Input placeholder="Title" value={ref.title} onChange={(e) => updateProtocolRef(idx, 'title', e.target.value)} />
                              <Input placeholder="Authors" value={ref.authors} onChange={(e) => updateProtocolRef(idx, 'authors', e.target.value)} />
                              <Input placeholder="Journal" value={ref.journal} onChange={(e) => updateProtocolRef(idx, 'journal', e.target.value)} />
                              <Input placeholder="Year" value={ref.year} onChange={(e) => updateProtocolRef(idx, 'year', e.target.value)} />
                              <Input placeholder="DOI (optional)" value={ref.doi} onChange={(e) => updateProtocolRef(idx, 'doi', e.target.value)} />
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setProtocol({ ...protocol, references: [...protocol.references, { title: '', authors: '', journal: '', year: '', doi: '' }] })}>Add Reference</Button>
                            <Button onClick={handleUpsertProtocol}>Save Protocol</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Search Results</h3>
                    <div className="space-y-3">
                      {searchResults.map((protocol: any) => (
                        <Card key={protocol.id} className="border-2 border-slate-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{protocol.title}</CardTitle>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline">{protocol.category}</Badge>
                                  <Badge className={
                                    protocol.evidenceLevel === 'high' ? 'bg-green-100 text-green-700' :
                                    protocol.evidenceLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-orange-100 text-orange-700'
                                  }>
                                    {protocol.evidenceLevel} evidence
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-4">
                              {protocol.content}
                            </p>
                            {protocol.references && protocol.references.length > 0 && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p className="font-semibold mb-2">Key References:</p>
                                {protocol.references.slice(0, 3).map((ref: any, idx: number) => (
                                  <div key={idx} className="mb-1">
                                    <p className="font-medium">{ref.title}</p>
                                    <p className="text-slate-400 dark:text-slate-500">
                                      {ref.authors} ({ref.year}). {ref.journal}
                                      {ref.doi && (
                                        <a 
                                          href={`https://doi.org/${ref.doi}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="ml-2 text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                                        >
                                          DOI <ExternalLink className="h-3 w-3" />
                                        </a>
                                      )}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
