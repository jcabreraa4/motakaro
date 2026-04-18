'use client';

import { useEffect, useState } from 'react';
import { useClerk, useOrganizationList, useSession } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { Label } from '@workspace/ui/components/label';
import { BuildingIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Env Variables
const redirectPage = process.env.NEXT_PUBLIC_REDIRECT_PAGE!;

// Toast Messages
const errorMessage = 'An internal error has occurred.';
const successMessage = 'Organization selected successfully.';

export default function OrgSelectionPage() {
  // Basic Hooks
  const router = useRouter();
  const { signOut } = useClerk();
  const { session } = useSession();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: { pageSize: 3 }
  });

  // State Hooks
  const [showSpinner, setShowSpinner] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  // Effect Hooks
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
          router.push(url);
        }
      });
    } catch {
      toast.error(errorMessage);
      setIsSelecting(false);
    }
  }

  // Loading State
  if (!isLoaded || isSelecting || userMemberships.isLoading || (!userMemberships?.data?.length && !showSpinner)) {
    return <CircleLoader className="text-white" />;
  }

  // No Organizations
  if (userMemberships?.data?.length === 0 || !userMemberships?.data) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader className="pointer-events-none select-none">
          <CardTitle className="text-xl font-bold">No Organizations Found</CardTitle>
          <CardDescription>Contact your organization admin for an invitation.</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-2">
          <Label>Signed in as {session?.user.primaryEmailAddress?.emailAddress}</Label>
          <Label
            className="cursor-pointer underline"
            onClick={() => signOut()}
          >
            Sign Out
          </Label>
        </CardFooter>
      </Card>
    );
  }

  // Selection Form
  return (
    <Card className="w-full max-w-lg bg-transparent shadow-none ring-0">
      <CardHeader className="pointer-events-none px-1 select-none">
        <CardTitle className="text-xl font-bold">Select Organization</CardTitle>
        <CardDescription>You&apos;ll be able to switch organizations within the app.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-1">
        {userMemberships?.data?.map((mem) => (
          <div
            key={mem.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg bg-sidebar-accent p-3 hover:bg-accent-foreground hover:text-white dark:border-white/35 dark:hover:text-black"
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
            <span className="truncate text-left text-sm leading-tight font-medium">{mem.organization.name}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 px-1">
        <Label>Signed in as {session?.user.primaryEmailAddress?.emailAddress}</Label>
        <Label
          className="cursor-pointer underline"
          onClick={() => signOut()}
        >
          Sign Out
        </Label>
      </CardFooter>
    </Card>
  );
}
