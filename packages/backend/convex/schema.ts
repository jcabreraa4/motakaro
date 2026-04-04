import { defineSchema, defineTable } from 'convex/server';
import { Doc } from './_generated/dataModel';
import { v } from 'convex/values';

export default defineSchema({
  // Motakaro Admins Users
  employees: defineTable({
    // Webhook Sync
    email: v.string(),
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    avatar: v.optional(v.string()),
    clerkId: v.string(),

    // Additional Columns
    seen: v.optional(v.number()),
    context: v.optional(v.string())
  }).index('by_clerkId', ['clerkId']),

  // Motakaro Clients Users
  contacts: defineTable({
    // Webhook Sync
    email: v.string(),
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    avatar: v.optional(v.string()),
    clerkId: v.string(),

    // Additional Columns
    seen: v.optional(v.number())
  }).index('by_clerkId', ['clerkId']),

  // Motakaro Clients Companies
  companies: defineTable({
    // Webhook Sync
    name: v.string(),
    logo: v.optional(v.string()),
    plan: v.optional(v.string()),
    clerkId: v.string()
  }).index('by_clerkId', ['clerkId']),

  // Contacts Companies Relationships
  memberships: defineTable({
    contactId: v.id('contacts'),
    companyId: v.id('companies'),
    orgRole: v.string()
  })
    .index('by_contactId', ['contactId'])
    .index('by_companyId', ['companyId'])
    .index('by_contactId_companyId', ['contactId', 'companyId']),

  // Calcom Meetings
  meetings: defineTable({
    // Webhook Sync
    name: v.string(),
    note: v.string(),
    url: v.string(),
    start: v.number(),
    end: v.number(),
    starred: v.boolean(),
    organizer: v.string(),
    attendees: v.array(v.string()),
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('ongoing'), v.literal('finished')),
    calcomId: v.string(),

    // Discovery Call Specifics
    website: v.optional(v.string()),
    attribution: v.optional(v.string()),

    // Reservation Changes Specifics
    rescheduling: v.optional(v.string()),
    cancellation: v.optional(v.string()),
    rejection: v.optional(v.string())
  }).index('by_calcomId', ['calcomId']),
  documents: defineTable({
    name: v.string(),
    note: v.string(),
    content: v.string(),
    starred: v.boolean(),
    updated: v.number()
  }).index('by_updated', ['updated']),
  whiteboards: defineTable({
    name: v.string(),
    note: v.string(),
    content: v.string(),
    starred: v.boolean(),
    updated: v.number()
  }).index('by_updated', ['updated']),
  multimedia: defineTable({
    name: v.string(),
    note: v.string(),
    type: v.string(),
    size: v.number(),
    starred: v.boolean(),
    updated: v.number(),
    storageId: v.id('_storage'),

    // Images and Videos Specifics
    width: v.optional(v.number()),
    height: v.optional(v.number())
  }).index('by_updated', ['updated']),
  resources: defineTable({
    name: v.string(),
    note: v.string(),
    link: v.string(),
    embed: v.string(),
    starred: v.boolean(),
    updated: v.number(),
    thumbnail: v.string(),
    published: v.boolean()
  }).index('by_updated', ['updated']),
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
export type Membership = Doc<'memberships'>;
export type Meeting = Doc<'meetings'>;
export type Document = Doc<'documents'>;
export type MediaFile = Doc<'multimedia'>;
export type Whiteboard = Doc<'whiteboards'>;
export type Resource = Doc<'resources'>;
export type Embedding = Doc<'embeddings'>;
