'use client';

import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';

import { api } from '@workspace/backend/_generated/api';

export function usePresence() {
  const { userId, isLoaded } = useAuth();

  const employees = useQuery(api.employees.list, isLoaded ? { filter: 'actives' } : 'skip');
  const updateEmployee = useMutation(api.employees.update);

  const actives = employees?.filter((employee) => employee.clerkId !== userId);

  useEffect(() => {
    if (!userId) return;
    updateEmployee({ seen: true });
    const interval = setInterval(() => updateEmployee({ seen: true }), 50000);
    return () => clearInterval(interval);
  }, [userId, updateEmployee]);

  return { actives };
}
