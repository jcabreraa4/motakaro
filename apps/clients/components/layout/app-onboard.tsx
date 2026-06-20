'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { RocketIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';

export function AppOnboard() {
  const { isLoaded } = useAuth();

  const client = useQuery(api.clients.clientGet, isLoaded ? {} : 'skip');
  const updateClient = useMutation(api.clients.clientUpdate);

  function completeOnboarding() {
    updateClient({ onboarded: true }).finally(() => {
      toast.success('Onboarding completed successfully!');
    });
  }

  if (!client) return null;

  return (
    <Dialog open={!client.onboarded}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Onboarding</DialogTitle>
          <DialogDescription>Welcome to Motakaro!</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={completeOnboarding}
            className="w-full cursor-pointer"
          >
            <RocketIcon />
            Complete Onboarding
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
