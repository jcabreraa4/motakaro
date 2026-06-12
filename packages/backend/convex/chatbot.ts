import { openai } from '@ai-sdk/openai';
import { Agent, listUIMessages, syncStreams, vStreamArgs } from '@convex-dev/agent';
import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';

import { api, components } from './_generated/api.js';
import { ActionCtx, MutationCtx, QueryCtx, action, mutation, query } from './_generated/server.js';
import { verifyAdminAuth } from './auth.js';

const DEFAULT_THREAD_TITLE = 'New conversation';
const THREADS_LIMIT = 50;

export const assistant = new Agent(components.agent, {
  name: 'Motakaro Assistant',
  languageModel: openai.chat('gpt-4o-mini'),
  embeddingModel: openai.embedding('text-embedding-3-small'),
  instructions: '',
  maxSteps: 15
});

// Helpers

function createTitle(title?: string) {
  const cleanTitle = title?.replaceAll(/\s+/g, ' ').trim();
  if (!cleanTitle) return DEFAULT_THREAD_TITLE;
  return cleanTitle.length > 48 ? `${cleanTitle.slice(0, 48)}…` : cleanTitle;
}

async function verifyThread(ctx: ActionCtx | MutationCtx | QueryCtx, threadId: string, userId: string) {
  // Obtain Thread
  const thread = await ctx.runQuery(components.agent.threads.getThread, { threadId });
  if (!thread) throw new ConvexError('Thread not found');

  // Check Ownership
  if (thread.userId !== userId) throw new ConvexError('Unauthorized');

  return thread;
}

async function getSystem(ctx: ActionCtx, clerkId: string, system?: string) {
  // Obtain Employee
  const employee = await ctx.runQuery(api.employees.get, {});

  if (!employee) {
    return [instructions, `Contexto del usuario autenticado:\n- Clerk ID: ${clerkId}\n- Employee: No encontrado`, system].filter(Boolean).join('\n\n');
  }

  const user = ['Contexto del usuario autenticado:', `- Clerk ID: ${clerkId}`, `- Employee ID: ${employee._id}`, `- Nombre: ${employee.name} ${employee.surname}`, `- Email: ${employee.email}`, `- Rol: ${employee.role || 'No especificado'}`, `- Onboarded: ${employee.onboarded ? 'sí' : 'no'}`].join('\n');

  return [instructions, user, system].filter(Boolean).join('\n\n');
}

// Admin Functions

export const createThread = mutation({
  args: {
    title: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Create Thread
    const { threadId } = await assistant.createThread(ctx, {
      userId: identity.subject,
      title: createTitle(args.title)
    });

    return threadId;
  }
});

export const listThreads = query({
  args: {},
  handler: async (ctx) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Return Threads
    const threads = await ctx.runQuery(components.agent.threads.listThreadsByUserId, {
      userId: identity.subject,
      order: 'desc',
      paginationOpts: { cursor: null, numItems: THREADS_LIMIT }
    });

    return threads.page.map((thread) => ({
      id: thread._id,
      title: thread.title || DEFAULT_THREAD_TITLE,
      status: thread.status,
      createdAt: thread._creationTime
    }));
  }
});

export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Check Thread
    await verifyThread(ctx, args.threadId, identity.subject);

    // Return Messages
    const paginated = await listUIMessages(ctx, components.agent, args);
    const streams = await syncStreams(ctx, components.agent, args);
    return { ...paginated, streams };
  }
});

export const sendMessage = action({
  args: {
    threadId: v.string(),
    prompt: v.string(),
    system: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Check Thread
    await verifyThread(ctx, args.threadId, identity.subject);

    // Obtain Context
    const system = await getSystem(ctx, identity.subject, args.system);

    // Generate Message
    await assistant.streamText(
      ctx,
      {
        threadId: args.threadId,
        userId: identity.subject
      },
      {
        prompt: args.prompt,
        system
      },
      {
        saveStreamDeltas: {
          chunking: 'word',
          throttleMs: 100
        }
      }
    );

    return { threadId: args.threadId };
  }
});
