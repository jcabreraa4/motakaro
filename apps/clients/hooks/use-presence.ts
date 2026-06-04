import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';

import { api } from '@workspace/backend/_generated/api';

export function usePresence() {
  const { userId } = useAuth();
  const update = useMutation(api.contacts.clientUpdate);

  useEffect(() => {
    if (!userId) return;
    update();
    const interval = setInterval(() => update(), 50000);
    return () => clearInterval(interval);
  }, [userId, update]);
}
