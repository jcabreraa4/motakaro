import { defineSchema, defineTable } from 'convex/server';
import { Doc } from './_generated/dataModel';
import { v } from 'convex/values';

export default defineSchema({
  workers: defineTable({
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    email: v.string(),
    avatar: v.optional(v.string()),
    seen: v.optional(v.number()),
    clerkId: v.string()
  }).index('by_clerk_id', ['clerkId']),
  meetings: defineTable({
    name: v.string(),
    note: v.string(),
    url: v.string(),
    start: v.number(),
    end: v.number(),
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('started'), v.literal('finished')),
    organizer: v.string(),
    attendees: v.array(v.string()),
    cancellation: v.optional(v.string()),
    rejection: v.optional(v.string()),
    calcomId: v.string()
  }).index('by_calcom_id', ['calcomId']),
  contacts: defineTable({
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    email: v.string(),
    avatar: v.optional(v.string()),
    seen: v.optional(v.number()),
    clerkId: v.string()
  }).index('by_clerk_id', ['clerkId']),
  companies: defineTable({
    name: v.string(),
    logo: v.optional(v.string()),
    plan: v.optional(v.string()),
    clerkId: v.string()
  }).index('by_clerk_id', ['clerkId']),
  documents: defineTable({
    name: v.string(),
    note: v.string(),
    starred: v.boolean(),
    updated: v.number(),
    content: v.string(),
    companyId: v.optional(v.id('companies'))
  })
    .index('by_updated', ['updated'])
    .index('by_companyId_updated', ['companyId', 'updated']),
  whiteboards: defineTable({
    name: v.string(),
    note: v.string(),
    starred: v.boolean(),
    updated: v.number(),
    content: v.string(),
    companyId: v.optional(v.id('companies'))
  })
    .index('by_updated', ['updated'])
    .index('by_companyId_updated', ['companyId', 'updated']),
  multimedia: defineTable({
    name: v.string(),
    note: v.string(),
    type: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    starred: v.boolean(),
    updated: v.number(),
    storageId: v.id('_storage'),
    companyId: v.optional(v.id('companies'))
  })
    .index('by_updated', ['updated'])
    .index('by_companyId_updated', ['companyId', 'updated']),
  resources: defineTable({
    name: v.string(),
    note: v.string(),
    link: v.string(),
    embed: v.string(),
    starred: v.boolean(),
    updated: v.number(),
    thumbnail: v.string(),
    published: v.boolean()
  })
});

export type Worker = Doc<'workers'>;
export type Meeting = Doc<'meetings'>;
export type Contact = Doc<'contacts'>;
export type Company = Doc<'companies'>;
export type Document = Doc<'documents'>;
export type MediaFile = Doc<'multimedia'>;
export type Whiteboard = Doc<'whiteboards'>;
export type Resource = Doc<'resources'>;
