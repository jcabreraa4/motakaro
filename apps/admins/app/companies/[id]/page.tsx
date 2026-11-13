import Link from 'next/link';

import { StepBackIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex h-screen w-full gap-3">
      <div className="h-full w-90 border-r bg-sidebar">
        <Link href="/companies">
          <Button
            variant="outline"
            className="w-full"
          >
            <StepBackIcon />
            Back to Companies
          </Button>
        </Link>
      </div>
      <div className="h-full w-full">Company ID: {id}</div>
    </div>
  );
}
