import { useEffect } from 'react';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';

import { api } from '@workspace/backend/_generated/api';

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
