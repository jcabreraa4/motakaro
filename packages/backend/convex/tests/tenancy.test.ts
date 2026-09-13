import { describe, expect, test } from 'vitest';

import { api } from '../_generated/api';
import { asClient, createTestBackend } from './test.setup';
import type { TestBackend } from './test.setup';

// Tenant Fixtures

async function seedTenantDocuments(t: TestBackend) {
  return await t.run(async (ctx) => {
    // Create Organizations
    const organizationA = await ctx.db.insert('organizations', {
      clerkId: 'org_a',
      name: 'Organization A',
      slug: 'organization-a',
      logo: '',
      plan: 'onboarding',
      onboarded: true,
      status: 'active',
      starred: false,
      updated: 1
    });
    const organizationB = await ctx.db.insert('organizations', {
      clerkId: 'org_b',
      name: 'Organization B',
      slug: 'organization-b',
      logo: '',
      plan: 'onboarding',
      onboarded: true,
      status: 'active',
      starred: false,
      updated: 1
    });

    // Create Documents
    const visibleDocument = await ctx.db.insert('documents', {
      name: 'Visible to organization A',
      note: '',
      content: 'Visible content',
      starred: false,
      updated: 3,
      clientVisible: true,
      clientStarred: false,
      organizationId: organizationA
    });
    await ctx.db.insert('documents', {
      name: 'Hidden from clients',
      note: '',
      content: 'Hidden content',
      starred: false,
      updated: 2,
      clientVisible: false,
      clientStarred: false,
      organizationId: organizationA
    });
    const foreignDocument = await ctx.db.insert('documents', {
      name: 'Owned by organization B',
      note: '',
      content: 'Foreign content',
      starred: false,
      updated: 1,
      clientVisible: true,
      clientStarred: false,
      organizationId: organizationB
    });

    // Return Documents
    return { visibleDocument, foreignDocument };
  });
}

// Tenancy Tests

describe('Convex tenant isolation', () => {
  test('lists only client-visible documents from the current organization', async () => {
    // Create Backend
    const t = createTestBackend();
    const { visibleDocument } = await seedTenantDocuments(t);

    // Obtain Documents
    const documents = await asClient(t).query(api.documents.clientList, {});

    // Verify Documents
    expect(documents).toHaveLength(1);
    expect(documents?.[0]).toMatchObject({
      _id: visibleDocument,
      name: 'Visible to organization A',
      clientVisible: true
    });
  });

  test('does not return a document owned by another organization', async () => {
    // Create Backend
    const t = createTestBackend();
    const { foreignDocument } = await seedTenantDocuments(t);

    // Verify Document
    await expect(asClient(t).query(api.documents.clientGet, { id: foreignDocument })).resolves.toBeNull();
  });

  test('prevents a client from updating a document owned by another organization', async () => {
    // Create Backend
    const t = createTestBackend();
    const { foreignDocument } = await seedTenantDocuments(t);

    // Verify Update
    await expect(
      asClient(t).mutation(api.documents.clientUpdate, {
        id: foreignDocument,
        name: 'Unauthorized change'
      })
    ).rejects.toThrow('Unauthorized');
  });

  test('allows a client to update a document owned by its organization', async () => {
    // Create Backend
    const t = createTestBackend();
    const { visibleDocument } = await seedTenantDocuments(t);
    const withClient = asClient(t);

    // Update Document
    await withClient.mutation(api.documents.clientUpdate, {
      id: visibleDocument,
      name: 'Updated by organization A',
      clientStarred: true
    });

    // Verify Document
    await expect(withClient.query(api.documents.clientGet, { id: visibleDocument })).resolves.toMatchObject({
      name: 'Updated by organization A',
      clientStarred: true
    });
  });
});
