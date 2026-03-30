'use server';

import { createClerkClient } from '@clerk/nextjs/server';

const client = createClerkClient({
  secretKey: process.env.CLERK_CLIENTS_APP_SECRET_KEY!
});

export async function listCompanies() {
  const { data: organizations } = await client.organizations.getOrganizationList({ limit: 500 });
  return await Promise.all(
    organizations.map(async (organization) => {
      try {
        const subscription = await client.billing.getOrganizationBillingSubscription(organization.id);
        const activeItem = subscription.subscriptionItems?.find((item) => item.status === 'active');
        return {
          id: organization.id,
          name: organization.name,
          logo: organization.imageUrl,
          plan: activeItem?.plan?.name ?? 'No Plan'
        };
      } catch {
        return {
          id: organization.id,
          name: organization.name,
          logo: organization.imageUrl,
          plan: undefined
        };
      }
    })
  );
}
