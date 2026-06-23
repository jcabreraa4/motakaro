import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';

import { components } from './_generated/api';
import { mutation, query } from './_generated/server';
import { chatbot } from './agents';
import { verifyAdminAuth } from './auth';

// Verified
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

    // Return Thread
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

    // Obtain Thread
    const thread = await ctx.runQuery(components.agent.threads.getThread, {
      threadId: args.threadId
    });
    if (!thread) throw new ConvexError('Thread not found');

    // Check Ownership
    if (thread.userId !== identity.subject) {
      throw new ConvexError('Unauthorized');
    }

    // Remove Thread
    await chatbot.deleteThreadAsync(ctx, {
      threadId: args.threadId
    });
  }
});
