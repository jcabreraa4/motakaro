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

  const contact = useQuery(api.contacts.clientGet, isLoaded ? {} : 'skip');
  const updateContact = useMutation(api.contacts.clientUpdate);

  function completeOnboarding() {
    updateContact({ onboarded: true }).then(() => {
      toast.success('Onboarding completed successfully!');
    });
  }

  if (!contact) return null;

  return (
    <Dialog open={!contact.onboarded}>
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
