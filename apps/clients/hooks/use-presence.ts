import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';

import { api } from '@workspace/backend/_generated/api';

export function usePresence() {
  const { userId } = useAuth();

  const updateContact = useMutation(api.contacts.clientUpdate);

  useEffect(() => {
    if (!userId) return;
    updateContact({});
    const interval = setInterval(() => updateContact({}), 50000);
    return () => clearInterval(interval);
  }, [userId, updateContact]);
}
