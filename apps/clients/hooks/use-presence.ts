import { api } from '@workspace/backend/_generated/api';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export function usePresence() {
  const { user } = useUser();
  const update = useMutation(api.contacts.clientsUpdate);

  useEffect(() => {
    if (!user) return;
    update();
    const interval = setInterval(() => update(), 60000);
    return () => clearInterval(interval);
  }, [user?.id, update, user]);
}
