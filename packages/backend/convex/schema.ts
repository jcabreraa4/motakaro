import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';

export const organizationPlan = v.union(v.literal('onboarding'), v.literal('rollout'), v.literal('scaling'));
export const organizationRole = v.union(v.literal('org:member'), v.literal('org:admin'));
export const organizationStatus = v.union(v.literal('active'), v.literal('inactive'));

export const meetingStatus = v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('ongoing'), v.literal('finished'));

export default defineSchema({
  // Motakaro Admins
  admins: defineTable({
    // Primary Columns
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    surname: v.string(),
    avatar: v.string(),

    onboarded: v.boolean(),

    starred: v.boolean(),
    updated: v.number(),

    // Additional Columns
    seen: v.optional(v.number()),
    note: v.optional(v.string()),

    role: v.optional(v.string()),
    phone: v.optional(v.number()),
    linkedin: v.optional(v.string())
  }).index('by_clerkId', ['clerkId']),

  // Motakaro Clients
  clients: defineTable({
    // Primary Columns
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    surname: v.string(),
    avatar: v.string(),

    onboarded: v.boolean(),

    starred: v.boolean(),
    updated: v.number(),

    // Additional Columns
    seen: v.optional(v.number()),
    note: v.optional(v.string()),

    role: v.optional(v.string()),
    phone: v.optional(v.number()),
    linkedin: v.optional(v.string())
  }).index('by_clerkId', ['clerkId']),

  // Motakaro Organizations
  organizations: defineTable({
    // Primary Columns
    clerkId: v.string(),
    name: v.string(),
    logo: v.string(),
    plan: organizationPlan,

    onboarded: v.boolean(),
    status: organizationStatus,

    starred: v.boolean(),
    updated: v.number(),

    // Additional Columns
    note: v.optional(v.string()),

    website: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    language: v.optional(v.string())
  }).index('by_clerkId', ['clerkId']),

  // Motakaro Invoices
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
    organizationId: v.id('organizations')
  }),

  // Clients Organizations
  memberships: defineTable({
    // Primary Columns
    clientId: v.id('clients'),
    organizationId: v.id('organizations'),
    organizationRole: organizationRole,

    updated: v.number()
  })
    .index('by_clientId', ['clientId'])
    .index('by_organizationId', ['organizationId'])
    .index('by_clientId_organizationId', ['clientId', 'organizationId']),

  // Organization Notifications
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
    organizationId: v.optional(v.id('organizations'))
  }).index('by_organizationId', ['organizationId']),

  // Organization Meetings
  meetings: defineTable({
    // Primary Columns
    calcomId: v.string(),
    name: v.string(),
    link: v.string(),
    start: v.number(),
    end: v.number(),
    organizer: v.string(),
    attendees: v.array(v.string()),
    status: meetingStatus,

    starred: v.boolean(),
    updated: v.number(),

    // Additional Columns
    note: v.optional(v.string()),
    website: v.optional(v.string()),
    attribution: v.optional(v.string()),

    rescheduling: v.optional(v.string()),
    cancellation: v.optional(v.string()),
    rejection: v.optional(v.string()),

    transcript: v.optional(v.string()),
    recording: v.optional(v.string())
  }).index('by_calcomId', ['calcomId']),

  // Organization Multimedia
  multimedia: defineTable({
    // Primary Columns
    name: v.string(),
    note: v.string(),
    type: v.string(),
    size: v.number(),
    storageId: v.id('_storage'),

    starred: v.boolean(),
    updated: v.number(),

    clientVisible: v.boolean(),
    clientStarred: v.boolean(),

    // Additional Columns
    width: v.optional(v.number()),
    height: v.optional(v.number()),

    // Relationship Columns
    organizationId: v.optional(v.id('organizations'))
  })
    .index('by_organizationId_updated', ['organizationId', 'updated'])
    .index('by_organizationId_clientVisible', ['organizationId', 'clientVisible']),

  // Organization Documents
  documents: defineTable({
    // Primary Columns
    name: v.string(),
    note: v.string(),
    content: v.string(),

    starred: v.boolean(),
    updated: v.number(),

    clientVisible: v.boolean(),
    clientStarred: v.boolean(),

    // Relationship Columns
    organizationId: v.optional(v.id('organizations'))
  })
    .index('by_organizationId_updated', ['organizationId', 'updated'])
    .index('by_organizationId_clientVisible', ['organizationId', 'clientVisible']),

  // Organization Whiteboards
  whiteboards: defineTable({
    // Primary Columns
    name: v.string(),
    note: v.string(),
    content: v.string(),

    starred: v.boolean(),
    updated: v.number(),

    clientVisible: v.boolean(),
    clientStarred: v.boolean(),

    // Relationship Columns
    organizationId: v.optional(v.id('organizations'))
  }).index('by_organizationId_updated', ['organizationId', 'updated']),

  // Motakaro Resources
  resources: defineTable({
    // Primary Columns
    name: v.string(),
    note: v.string(),
    link: v.string(),
    embed: v.string(),
    thumbnail: v.string(),
    published: v.boolean(),

    starred: v.boolean(),
    updated: v.number()
  })
    .index('by_updated', ['updated'])
    .index('by_published', ['published'])
});

export type Admin = Doc<'admins'>;
export type Client = Doc<'clients'>;
export type Organization = Doc<'organizations'>;
export type Invoice = Doc<'invoices'>;
export type Membership = Doc<'memberships'>;
export type Notification = Doc<'notifications'>;
export type Meeting = Doc<'meetings'>;
export type MediaFile = Doc<'multimedia'> & { url: string | null };
export type Document = Doc<'documents'>;
export type Whiteboard = Doc<'whiteboards'>;
export type Resource = Doc<'resources'>;
