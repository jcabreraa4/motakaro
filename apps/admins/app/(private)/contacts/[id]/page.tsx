import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { ContactsPage } from '@/components/contacts/contacts-page';
import { runConvex } from '@/server/run-convex';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { token } = await runConvex();
  const contact = await preloadQuery(api.contacts.get, { id }, { token });

  return <ContactsPage preloaded={contact} />;
}
