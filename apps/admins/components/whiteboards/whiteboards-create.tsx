import { cloneElement } from 'react';

import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Id } from '@workspace/backend/_generated/dataModel';

interface WhiteboardsCreateProps {
  onSuccess?: (id: Id<'whiteboards'>) => void;
  children: React.ReactNode;
}

export function WhiteboardsCreate({ onSuccess, children }: WhiteboardsCreateProps) {
  const createWhiteboard = useMutation(api.whiteboards.create);

  function handleCreate() {
    createWhiteboard({})
      .then((id) => {
        toast.success('Whiteboard created successfully.');
        onSuccess?.(id);
      })
      .catch(() => toast.error('An internal error has ocurred.'));
  }

  return cloneElement(children as React.ReactElement<{ onClick: () => void }>, {
    onClick: handleCreate
  });
}
