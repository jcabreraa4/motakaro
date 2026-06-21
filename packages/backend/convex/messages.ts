import { getThreadMetadata, listUIMessages, saveMessage, syncStreams, vStreamArgs } from '@convex-dev/agent';
import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';

import { components, internal } from './_generated/api';
import { internalAction, mutation, query } from './_generated/server';
import { chatbot } from './agents';
import { verifyAdminAuth } from './auth';

async function verifyThreadAccess(ctx: Parameters<typeof verifyAdminAuth>[0], threadId: string) {
  const identity = await verifyAdminAuth(ctx);
  const thread = await getThreadMetadata(ctx, components.agent, { threadId });

  if (!thread || thread.userId !== identity.subject) {
    throw new ConvexError('Thread not found');
  }

  return { identity, thread };
}

export const list = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs
  },
  handler: async (ctx, args) => {
    // Verify Identity
    await verifyThreadAccess(ctx, args.threadId);

    // Return Messages
    const paginated = await listUIMessages(ctx, components.agent, args);
    const streams = await syncStreams(ctx, components.agent, args);
    return { ...paginated, streams };
  }
});

export const create = mutation({
  args: {
    threadId: v.string(),
    message: v.string()
  },
  handler: async (ctx, args) => {
    // Verify Identity
    const { identity } = await verifyThreadAccess(ctx, args.threadId);

    // Save Message
    const { messageId } = await saveMessage(ctx, components.agent, {
      threadId: args.threadId,
      userId: identity.subject,
      message: { role: 'user', content: args.message }
    });

    // Generate Response
    await ctx.scheduler.runAfter(0, internal.messages.generate, {
      threadId: args.threadId,
      promptMessageId: messageId
    });

    return messageId;
  }
});

export const generate = internalAction({
  args: {
    threadId: v.string(),
    promptMessageId: v.string()
  },
  handler: async (ctx, args) => {
    // Continue Thread
    const { thread } = await chatbot.continueThread(ctx, { threadId: args.threadId });
    // Generate Response
    await thread.streamText({ promptMessageId: args.promptMessageId }, { saveStreamDeltas: true });
  }
});
