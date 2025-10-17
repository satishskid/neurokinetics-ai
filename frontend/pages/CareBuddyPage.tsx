import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useBackend } from '@/lib/useBackend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  references?: Array<{
    title: string;
    source: string;
    url?: string;
  }>;
  createdAt: Date;
}

export default function CareBuddyPage() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startConversationMutation = useMutation({
    mutationFn: async () =>
      backend.carebuddy.startConversation({}),
    onSuccess: (data) => {
      setConversationId(data.id);
    },
    onError: (error) => {
      console.error('Failed to start conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive',
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) =>
      backend.carebuddy.sendMessage({
        conversationId: conversationId!,
        content,
      }),
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data.userMessage, data.assistantMessage]);
      setInput('');
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (!conversationId) {
      startConversationMutation.mutate();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !conversationId) return;
    sendMessageMutation.mutate(input);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Care Buddy</h1>
            <p className="text-slate-600 dark:text-slate-400">Your 24/7 autism support companion</p>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto h-[600px] flex flex-col">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Care Buddy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-600 dark:text-slate-400 py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Hello! I'm Care Buddy</h3>
                <p className="mb-2">Your trusted companion for autism support and guidance.</p>
                <p className="text-sm">
                  I can help with interventions, answer questions about your child's development,<br />
                  provide evidence-based resources, and support you every step of the way.
                </p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 max-w-[80%] ${
                    message.role === 'assistant'
                      ? 'bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  {message.references && message.references.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-300 dark:border-gray-600">
                      <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">References:</p>
                      <div className="space-y-1">
                        {message.references.map((ref, idx) => (
                          <div key={idx} className="text-xs text-slate-600 dark:text-slate-400">
                            <span className="font-medium">{ref.title}</span>
                            <span className="text-slate-500 dark:text-slate-500"> — {ref.source}</span>
                            {ref.url && (
                              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 dark:text-blue-400 hover:underline">
                                [Link]
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about autism care and support..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={!conversationId}
                className="rounded-full"
              />
              <Button onClick={handleSend} disabled={!conversationId || !input.trim()} className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
