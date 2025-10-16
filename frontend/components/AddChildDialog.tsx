import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useBackend } from '@/lib/useBackend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface AddChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddChildDialog({ open, onOpenChange, onSuccess }: AddChildDialogProps) {
  const { toast } = useToast();
  const backend = useBackend();
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    sex: '',
    developmentalConcerns: '',
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const dob = new Date(formData.dateOfBirth);
      const ageMonths = Math.floor(
        (new Date().getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
      );

      return backend.child.create({
        name: formData.name,
        dateOfBirth: dob,
        ageMonths,
        sex: formData.sex as 'male' | 'female' | 'other',
        developmentalConcerns: formData.developmentalConcerns || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Child profile created successfully',
      });
      setFormData({ name: '', dateOfBirth: '', sex: '', developmentalConcerns: '' });
      onSuccess();
    },
    onError: (error) => {
      console.error('Failed to create child:', error);
      toast({
        title: 'Error',
        description: 'Failed to create child profile',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dateOfBirth || !formData.sex) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Child Profile</DialogTitle>
          <DialogDescription>
            Enter your child's information to get started with assessments
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter child's name"
            />
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="sex">Sex *</Label>
            <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="concerns">Developmental Concerns (Optional)</Label>
            <Textarea
              id="concerns"
              value={formData.developmentalConcerns}
              onChange={(e) => setFormData({ ...formData, developmentalConcerns: e.target.value })}
              placeholder="Any specific concerns or observations..."
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
