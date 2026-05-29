import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';

export default defineSchema({
  // Motakaro Admins
  employees: defineTable({
    // Primary Columns
    email: v.string(),
    name: v.string(),
    surname: v.string(),
    avatar: v.string(),
    clerkId: v.string(),

    starred: v.boolean(),
    onboarded: v.boolean(),
    updated: v.number(),

    // Additional Columns
    seen: v.optional(v.number()),
    note: v.optional(v.string()),
    role: v.optional(v.string()),
    phone: v.optional(v.number()),
    linkedin: v.optional(v.string())
  }).index('by_clerkId', ['clerkId']),

  // Motakaro Clients
  contacts: defineTable({
    // Primary Columns
    email: v.string(),
    name: v.string(),
    surname: v.string(),
    avatar: v.string(),
    clerkId: v.string(),

    starred: v.boolean(),
    onboarded: v.boolean(),
    updated: v.number(),

    // Additional Columns
    seen: v.optional(v.number()),
    note: v.optional(v.string()),
    role: v.optional(v.string()),
    phone: v.optional(v.number()),
    linkedin: v.optional(v.string())
  }).index('by_clerkId', ['clerkId']),

  // Motakaro Companies
  companies: defineTable({
    // Primary Columns
    name: v.string(),
    logo: v.string(),
    plan: v.union(v.literal('onboarding'), v.literal('rollout'), v.literal('scaling')),
    clerkId: v.string(),

    status: v.union(v.literal('active'), v.literal('inactive'), v.literal('deleted')),
    starred: v.boolean(),
    onboarded: v.boolean(),
    updated: v.number(),

    // Additional Columns
    note: v.optional(v.string()),
    website: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    language: v.optional(v.string())
  }).index('by_clerkId', ['clerkId']),

  // Motakaro Clients Payments
  invoices: defineTable({
    // Primary Columns
    name: v.string(),
    amount: v.number(),
    starred: v.boolean(),
    updated: v.number(),

    // Additional Columns
    note: v.optional(v.string()),
    link: v.optional(v.string()),

    // Relationship Columns
    companyId: v.id('companies')
  }),

  // Contacts Companies Relationships
  memberships: defineTable({
    // Primary Columns
    orgRole: v.union(v.literal('org:member'), v.literal('org:admin')),
    contactId: v.id('contacts'),
    companyId: v.id('companies'),

    updated: v.number()
  })
    .index('by_contactId', ['contactId'])
    .index('by_companyId', ['companyId'])
    .index('by_contactId_companyId', ['contactId', 'companyId']),

  // Users Notifications
  notifications: defineTable({
    // Primary Columns
    name: v.string(),
    read: v.boolean(),
    content: v.string(),
    starred: v.boolean(),
    updated: v.number(),

    // Additional Columns
    note: v.optional(v.string()),
    link: v.optional(v.string()),

    // Relationship Columns
    companyId: v.optional(v.id('companies'))
  }).index('by_companyId', ['companyId']),

  // Calcom Meetings
  meetings: defineTable({
    // Primary Columns
    name: v.string(),
    link: v.string(),
    start: v.number(),
    end: v.number(),
    organizer: v.string(),
    attendees: v.array(v.string()),
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('ongoing'), v.literal('finished')),
    calcomId: v.string(),
    starred: v.boolean(),

    // Additional Columns
    note: v.optional(v.string()),
    website: v.optional(v.string()),
    attribution: v.optional(v.string()),
    rescheduling: v.optional(v.string()),
    cancellation: v.optional(v.string()),
    rejection: v.optional(v.string())
  }).index('by_calcomId', ['calcomId']),

  // Company Documents
  documents: defineTable({
    // Primary Columns
    name: v.string(),
    content: v.string(),
    starred: v.boolean(),
    updated: v.number(),

    // Additional Columns
    note: v.optional(v.string()),

    // Relationship Columns
    companyId: v.optional(v.id('companies'))
  }).index('by_companyId_updated', ['companyId', 'updated']),

  // Company Whiteboards
  whiteboards: defineTable({
    // Primary Columns
    name: v.string(),
    content: v.string(),
    starred: v.boolean(),
    updated: v.number(),

    // Additional Columns
    note: v.optional(v.string()),

    // Relationship Columns
    companyId: v.optional(v.id('companies'))
  }).index('by_companyId_updated', ['companyId', 'updated']),

  // Company Multimedia
  multimedia: defineTable({
    // Primary Columns
    name: v.string(),
    type: v.string(),
    size: v.number(),
    starred: v.boolean(),
    updated: v.number(),
    storageId: v.id('_storage'),

    clientsVisible: v.boolean(),
    clientsStarred: v.boolean(),

    // Additional Columns
    note: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),

    // Relationship Columns
    companyId: v.optional(v.id('companies'))
  })
    .index('by_companyId_updated', ['companyId', 'updated'])
    .index('by_companyId_clientsVisible_updated', ['companyId', 'clientsVisible', 'updated']),

  // Website Resources
  resources: defineTable({
    // Primary Columns
    name: v.string(),
    link: v.string(),
    embed: v.string(),
    thumbnail: v.string(),
    published: v.boolean(),
    starred: v.boolean(),
    updated: v.number(),

    // Additional Columns
    note: v.optional(v.string())
  })
    .index('by_updated', ['updated'])
    .index('by_published_updated', ['published', 'updated']),

  // Chatbot Knowledge
  embeddings: defineTable({
    source: v.string(),
    content: v.string(),
    vector: v.array(v.float64())
  }).vectorIndex('by_vector', {
    vectorField: 'vector',
    dimensions: 1536
  })
});

export type Employee = Doc<'employees'>;
export type Contact = Doc<'contacts'>;
export type Company = Doc<'companies'>;
export type Invoice = Doc<'invoices'>;
export type Membership = Doc<'memberships'>;
export type Notification = Doc<'notifications'>;
export type Meeting = Doc<'meetings'>;
export type Document = Doc<'documents'>;
export type MediaFile = Doc<'multimedia'> & { url: string | null };
export type Whiteboard = Doc<'whiteboards'>;
export type Resource = Doc<'resources'>;
export type Embedding = Doc<'embeddings'>;
