'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { ArrowLeftIcon, ArrowRightIcon, LinkIcon, MailIcon, PhoneIcon, RocketIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group';
import { Label } from '@workspace/ui/components/label';

export function AppOnboard() {
  const { isLoaded } = useAuth();

  const admin = useQuery(api.admins.get, isLoaded ? {} : 'skip');
  const updateAdmin = useMutation(api.admins.update);

  const [step, setStep] = useState(0);
  const [info, setInfo] = useState({ phone: '', twitter: '', linkedin: '' });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInfo({ phone: admin?.phone || '', twitter: admin?.twitter || '', linkedin: admin?.linkedin || '' });
  }, [admin?.phone, admin?.twitter, admin?.linkedin]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep(0);
  }, [admin?.onboarded]);

  function handleUpdate() {
    updateAdmin({ onboarded: true, phone: info.phone, twitter: info.twitter, linkedin: info.linkedin })
      .then(() => toast.success('Onboarding completed successfully.'))
      .catch(() => toast.error('An internal error has ocurred.'));
  }

  function nextStep() {
    setStep(step + 1);
  }

  function prevStep() {
    setStep(step - 1);
  }

  if (!admin) return null;

  return (
    <Dialog open={!admin.onboarded}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        {step === 0 && (
          <>
            <DialogHeader>
              <DialogTitle>User Onboarding</DialogTitle>
              <DialogDescription>Contact Information</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email Address</Label>
                <InputGroup>
                  <InputGroupInput
                    disabled
                    id="email"
                    type="email"
                    value={admin.email}
                  />
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <InputGroup>
                  <InputGroupInput
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  />
                  <InputGroupAddon>
                    <PhoneIcon />
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
            <DialogFooter>
              <Button
                className="w-full"
                onClick={nextStep}
              >
                <ArrowRightIcon />
                Next Step
              </Button>
            </DialogFooter>
          </>
        )}
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>User Onboarding</DialogTitle>
              <DialogDescription>Social Media Profiles</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="twitter">Twitter Profile</Label>
                <InputGroup>
                  <InputGroupInput
                    id="twitter"
                    value={info.twitter}
                    placeholder="https://twitter.com/username"
                    onChange={(e) => setInfo({ ...info, twitter: e.target.value })}
                  />
                  <InputGroupAddon>
                    <LinkIcon />
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <InputGroup>
                  <InputGroupInput
                    id="linkedin"
                    value={info.linkedin}
                    placeholder="https://linkedin.com/in/username"
                    onChange={(e) => setInfo({ ...info, linkedin: e.target.value })}
                  />
                  <InputGroupAddon>
                    <LinkIcon />
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
            <DialogFooter className="flex-row">
              <Button
                className="flex-1"
                onClick={prevStep}
              >
                <ArrowLeftIcon />
                Previous Step
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpdate}
              >
                <RocketIcon />
                End Onboarding
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
