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

// Verified Query
export const list = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs
  },
  handler: async (ctx, args) => {
    // Verify Identity
    await verifyThreadAccess(ctx, args.threadId);

    // Obtain Messages
    const messages = await listUIMessages(ctx, components.agent, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts
    });

    // Obtain Streams
    const streams = await syncStreams(ctx, components.agent, {
      threadId: args.threadId,
      streamArgs: args.streamArgs
    });

    // Return Result
    return { ...messages, streams };
  }
});

export const create = mutation({
  args: {
    threadId: v.string(),
    prompt: v.string()
  },
  handler: async (ctx, args) => {
    // Verify Identity
    const { identity } = await verifyThreadAccess(ctx, args.threadId);

    // Save Message
    const { messageId } = await saveMessage(ctx, components.agent, {
      threadId: args.threadId,
      prompt: args.prompt
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
