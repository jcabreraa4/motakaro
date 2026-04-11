import type { ToolUIPart, InferUITools, UIDataTypes, UIMessage } from 'ai';
import { api } from '@workspace/backend/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { auth } from '@clerk/nextjs/server';
import { tool } from 'ai';
import { z } from 'zod';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const tools = {
  listMultimedia: tool({
    description: `List all media files.`,
    inputSchema: z.object(),
    async execute() {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain all Multimedia
        const multimedia = await client.query(api.multimedia.list);

        // Return all Multimedia
        if (!multimedia || multimedia.length === 0) {
          return {
            status: 200,
            content: 'No media files found.'
          };
        }
        return {
          status: 200,
          content: multimedia
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading media files: ${error}`
        };
      }
    }
  }),
  getMultimedia: tool({
    description: `Get an specific media file.`,
    inputSchema: z.object({
      id: z.string()
    }),
    async execute({ id }) {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain the Media File
        const multimedia = await client.query(api.multimedia.get, { id });

        // Return the Media File
        if (!multimedia) {
          return {
            status: 200,
            content: 'No media file found.'
          };
        }
        return {
          status: 200,
          content: multimedia
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading media file: ${error}`
        };
      }
    }
  })
};

// General Types
export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

// Tools Types
export type ListMultimediaPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-listMultimedia' }>;
export type GetMultimediaPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-getMultimedia' }>;
