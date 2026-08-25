'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { ListVideoIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { EmptySection } from '@workspace/ui/components/custom/empty-section';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';

import { InsetSection } from '@/components/layout/inset-section';
import { ResourcesRender } from '@/components/resources/resources-render';
import { ResourcesToolbar } from '@/components/resources/resources-toolbar';
import { useHeader } from '@/hooks/use-header';

interface ResourcesPageProps {
  preloaded: Preloaded<typeof api.resources.get>;
}

export function ResourcesPage({ preloaded }: ResourcesPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <GenericLoader />;
  return <ResourcesLoaded preloaded={preloaded} />;
}

function ResourcesLoaded({ preloaded }: ResourcesPageProps) {
  const { setBreadcrumbs } = useHeader();

  const resource = usePreloadedQuery(preloaded);

  useEffect(() => {
    if (resource) setBreadcrumbs([{ text: resource.name || 'Untitled Resource' }]);
    else setBreadcrumbs([{ text: '404 Not Found' }]);
    return () => setBreadcrumbs([]);
  }, [resource, setBreadcrumbs]);

  if (!resource) {
    return (
      <InsetSection>
        <EmptySection
          icon={ListVideoIcon}
          title="404 Not Found"
          description="The resource record could not be found."
        >
          <Link href="/resources">
            <Button>
              <ListVideoIcon />
              Check Resources
            </Button>
          </Link>
        </EmptySection>
      </InsetSection>
    );
  }

  return (
    <InsetSection className="flex flex-col gap-3 md:gap-5">
      <ResourcesToolbar resource={resource} />
      <ResourcesRender resource={resource} />
    </InsetSection>
  );
}
