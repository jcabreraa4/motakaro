import { api } from '@workspace/backend/_generated/api';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export function usePresence() {
  const { user } = useUser();
  const update = useMutation(api.contacts.update);

  useEffect(() => {
    if (!user) return;
    update({ clerkId: user.id });
    const interval = setInterval(() => update({ clerkId: user.id }), 60000);
    return () => clearInterval(interval);
  }, [user?.id, update, user]);
}
