import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';

import { components } from './_generated/api';
import { mutation, query } from './_generated/server';
import { chatbot } from './agents';
import { verifyAdminAuth } from './auth';

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    // Verify Identity
    const identity = await verifyAdminAuth(ctx);

    // Return Threads
    return await ctx.runQuery(components.agent.threads.listThreadsByUserId, {
      userId: identity.subject,
      paginationOpts: args.paginationOpts
    });
  }
});

export const create = mutation({
  handler: async (ctx) => {
    // Verify Identity
    const identity = await verifyAdminAuth(ctx);

    // Create Thread
    const { threadId } = await chatbot.createThread(ctx, {
      userId: identity.subject,
      title: 'Motakaro Assistant'
    });

    return threadId;
  }
});

export const remove = mutation({
  args: {
    threadId: v.string()
  },
  handler: async (ctx, args) => {
    // Verify Identity
    const identity = await verifyAdminAuth(ctx);

    // Verify Thread Ownership
    const thread = await ctx.runQuery(components.agent.threads.getThread, {
      threadId: args.threadId
    });

    if (!thread || thread.userId !== identity.subject) {
      throw new ConvexError('Thread not found');
    }

    // Delete Thread
    await chatbot.deleteThreadAsync(ctx, {
      threadId: args.threadId
    });
  }
});
