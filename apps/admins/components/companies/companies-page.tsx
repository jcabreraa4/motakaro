'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { Building2Icon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { EmptySection } from '@workspace/ui/components/custom/empty-section';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';

import { AppSection } from '@/components/layout/app-section';
import { useHeader } from '@/hooks/use-header';

interface CompaniesPageProps {
  preloaded: Preloaded<typeof api.organizations.get>;
}

export function CompaniesPage({ preloaded }: CompaniesPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <GenericLoader />;
  return <CompaniesLoaded preloaded={preloaded} />;
}

export function CompaniesLoaded({ preloaded }: CompaniesPageProps) {
  const { setBreadcrumbs } = useHeader();

  const company = usePreloadedQuery(preloaded);

  useEffect(() => {
    if (company) setBreadcrumbs([{ text: company.name }]);
    else setBreadcrumbs([{ text: '404 Not Found' }]);
    return () => setBreadcrumbs([]);
  }, [company, setBreadcrumbs]);

  if (!company) {
    return (
      <AppSection>
        <EmptySection
          icon={Building2Icon}
          title="404 Not Found"
          description="The company record could not be found."
        >
          <Link href="/companies">
            <Button className="cursor-pointer">
              <Building2Icon />
              Check Companies
            </Button>
          </Link>
        </EmptySection>
      </AppSection>
    );
  }

  return (
    <AppSection>
      <p>{company.name}</p>
    </AppSection>
  );
}
