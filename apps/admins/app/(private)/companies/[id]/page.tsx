import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { CompaniesPage } from '@/components/companies/companies-page';
import { runConvex } from '@/server/run-convex';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { token } = await runConvex();
  const company = await preloadQuery(api.organizations.get, { id }, { token });

  return <CompaniesPage preloaded={company} />;
}
