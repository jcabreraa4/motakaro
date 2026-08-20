'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useClerk, useOrganizationList, useSession } from '@clerk/nextjs';
import { BuildingIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';
import { Field, FieldDescription, FieldGroup } from '@workspace/ui/components/field';

const redirectPage = process.env.NEXT_PUBLIC_REDIRECT_PAGE!;

const errorMessage = 'An internal error has occurred.';
const successMessage = 'Organization selected successfully.';

export default function OrgSelectionPage() {
  const { push } = useRouter();
  const { signOut } = useClerk();
  const { session } = useSession();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: { pageSize: 3 }
  });

  const [showSpinner, setShowSpinner] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (!isLoaded || isSelecting || userMemberships.isLoading) {
      setShowSpinner(false);
      return;
    }
    if (userMemberships?.data?.length === 0 || !userMemberships?.data) {
      const timer = setTimeout(() => setShowSpinner(true), 300);
      return () => clearTimeout(timer);
    }
    setShowSpinner(false);
  }, [isLoaded, isSelecting, userMemberships.isLoading, userMemberships?.data]);

  // Selection Submit
  async function handleSelect(orgId: string) {
    if (!setActive) return;
    setIsSelecting(true);
    try {
      await setActive({
        organization: orgId,
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl(redirectPage);
          toast.success(successMessage);
          push(url);
        }
      });
    } catch {
      toast.error(errorMessage);
      setIsSelecting(false);
    }
  }

  // Sign Out
  function handleSignOut() {
    signOut()
      .then(() => toast.success('You signed out successfully.'))
      .catch(() => toast.error('An internal error has ocurred.'));
  }

  // Loading State
  if (!isLoaded || isSelecting || userMemberships.isLoading || (!userMemberships?.data?.length && !showSpinner)) {
    return <GenericLoader />;
  }

  // No Organizations
  if (userMemberships?.data?.length === 0 || !userMemberships?.data) {
    return (
      <FieldGroup>
        <div className="flex flex-col items-center gap-1">
          <p className="text-2xl font-bold">No Organizations</p>
          <p className="text-sm text-balance text-muted-foreground">Contact an organization admin for an invitation</p>
        </div>
        <Field>
          <FieldDescription className="text-center">
            Signed in as {session?.user.primaryEmailAddress?.emailAddress}{' '}
            <span
              className="cursor-pointer underline underline-offset-4 hover:text-black dark:hover:text-white"
              onClick={handleSignOut}
            >
              Sign out
            </span>
          </FieldDescription>
        </Field>
      </FieldGroup>
    );
  }

  // Selection Form
  return (
    <FieldGroup>
      <div className="flex flex-col items-center gap-1">
        <p className="text-2xl font-bold">Select Organization</p>
        <p className="text-sm text-balance text-muted-foreground">You&apos;ll be able to switch organizations within the app</p>
      </div>
      <Field className="flex flex-col gap-3">
        {userMemberships?.data?.map((mem) => (
          <Button
            key={mem.id}
            variant="outline"
            className="flex h-14 cursor-pointer justify-start gap-2"
            onClick={() => handleSelect(mem.organization.id)}
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={mem.organization.imageUrl}
                alt={mem.organization.name}
              />
              <AvatarFallback className="rounded-lg">
                <BuildingIcon />
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-left leading-tight font-medium">{mem.organization.name}</span>
          </Button>
        ))}
      </Field>
      <Field>
        <FieldDescription className="text-center">
          Signed in as {session?.user.primaryEmailAddress?.emailAddress}{' '}
          <span
            className="cursor-pointer underline underline-offset-4 hover:text-black dark:hover:text-white"
            onClick={handleSignOut}
          >
            Sign out
          </span>
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
