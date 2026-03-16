import { defineSchema, defineTable } from 'convex/server';
import { Doc } from './_generated/dataModel';
import { v } from 'convex/values';

export default defineSchema({
  companies: defineTable({
    name: v.string(),
    logo: v.optional(v.string()),
    plan: v.optional(v.string()),
    clerkId: v.string()
  }).index('by_clerk_id', ['clerkId']),
  contacts: defineTable({
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    email: v.string(),
    avatar: v.optional(v.string()),
    clerkId: v.string()
  }).index('by_clerk_id', ['clerkId']),
  documents: defineTable({
    name: v.string(),
    note: v.string(),
    starred: v.boolean(),
    updated: v.number(),
    content: v.string(),
    companyId: v.optional(v.id('companies'))
  }),
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
  }),
  resources: defineTable({
    name: v.string(),
    note: v.string(),
    link: v.string(),
    embed: v.string(),
    starred: v.boolean(),
    updated: v.number(),
    thumbnail: v.string()
  }),
  meetings: defineTable({
    name: v.string(),
    note: v.string(),
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('started'), v.literal('finished')),
    attendees: v.array(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    calcomId: v.string()
  }).index('by_calcom_id', ['calcomId'])
});

export type Company = Doc<'companies'>;
export type Contact = Doc<'contacts'>;
export type Document = Doc<'documents'>;
export type MediaFile = Doc<'multimedia'>;
export type Resource = Doc<'resources'>;
