import { api } from '@workspace/backend/_generated/api';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export function usePresence() {
  const { user } = useUser();
  const update = useMutation(api.employees.update);

  useEffect(() => {
    if (!user) return;
    update({ clerkId: user.id, seen: true });
    const interval = setInterval(() => update({ clerkId: user.id, seen: true }), 60000);
    return () => clearInterval(interval);
  }, [user?.id, update, user]);
}
