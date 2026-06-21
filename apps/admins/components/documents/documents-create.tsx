import { cloneElement } from 'react';

import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Id } from '@workspace/backend/_generated/dataModel';

interface DocumentsCreateProps {
  organizationId?: Id<'organizations'>;
  onSuccess?: (id: Id<'documents'>) => void;
  children: React.ReactNode;
}

export function DocumentsCreate({ organizationId, onSuccess, children }: DocumentsCreateProps) {
  const createDocument = useMutation(api.documents.create);

  function handleCreate() {
    createDocument({ organizationId })
      .then((id) => {
        toast.success('Document created successfully.');
        onSuccess?.(id);
      })
      .catch(() => toast.error('An internal error has ocurred.'));
  }

  return cloneElement(children as React.ReactElement<{ onClick: () => void }>, {
    onClick: handleCreate
  });
}
