import { defineSchema, defineTable } from 'convex/server';
import { Doc } from './_generated/dataModel';
import { v } from 'convex/values';

export default defineSchema({
  employees: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    avatar: v.optional(v.string()),
    seen: v.optional(v.number()),
    context: v.optional(v.string()),
    clerkId: v.string()
  }).index('by_clerkId', ['clerkId']),
  contacts: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    avatar: v.optional(v.string()),
    seen: v.optional(v.number()),
    clerkId: v.string()
  }).index('by_clerkId', ['clerkId']),
  companies: defineTable({
    name: v.string(),
    logo: v.optional(v.string()),
    plan: v.optional(v.string()),
    clerkId: v.string()
  }).index('by_clerkId', ['clerkId']),
  meetings: defineTable({
    name: v.string(),
    note: v.string(),
    url: v.string(),
    start: v.number(),
    end: v.number(),
    starred: v.boolean(),
    organizer: v.string(),
    attendees: v.array(v.string()),
    website: v.optional(v.string()),
    attribution: v.optional(v.string()),
    rescheduled: v.optional(v.string()),
    cancellation: v.optional(v.string()),
    rejection: v.optional(v.string()),
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('ongoing'), v.literal('finished')),
    calcomId: v.string()
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
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    starred: v.boolean(),
    updated: v.number(),
    storageId: v.id('_storage')
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
export type Meeting = Doc<'meetings'>;
export type Document = Doc<'documents'>;
export type MediaFile = Doc<'multimedia'>;
export type Whiteboard = Doc<'whiteboards'>;
export type Resource = Doc<'resources'>;
export type Embedding = Doc<'embeddings'>;
