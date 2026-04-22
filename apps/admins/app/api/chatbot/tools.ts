import type { ToolUIPart, InferUITools, UIDataTypes, UIMessage } from 'ai';
import { tiptapToMarkdown } from '@/lib/documents/tiptap-to-markdown';
import { api } from '@workspace/backend/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { auth } from '@clerk/nextjs/server';
import { tool } from 'ai';
import { z } from 'zod';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const tools = {
  meetingsList: tool({
    description: 'List all meetings.',
    inputSchema: z.object(),
    async execute() {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain all Meetings
        const meetings = await client.query(api.meetings.list);

        // Return all Meetings
        if (!meetings || meetings.length === 0) {
          return {
            status: 200,
            content: 'No meetings found.'
          };
        }
        return {
          status: 200,
          content: meetings
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading meetings: ${error}`
        };
      }
    }
  }),
  meetingsGet: tool({
    description: 'Get an specific meeting.',
    inputSchema: z.object({
      id: z.string().describe('The ID of the meeting.')
    }),
    async execute({ id }) {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain the Meeting
        const meeting = await client.query(api.meetings.get, { id });

        // Return the Meeting
        if (!meeting) {
          return {
            status: 200,
            content: 'No meeting found.'
          };
        }
        return {
          status: 200,
          content: meeting
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading meeting: ${error}`
        };
      }
    }
  }),
  documentsList: tool({
    description: 'List all documents.',
    inputSchema: z.object(),
    async execute() {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain all Documents
        const documents = await client.query(api.documents.list);

        // Return all Documents
        if (!documents || documents.length === 0) {
          return {
            status: 200,
            content: 'No documents found.'
          };
        }
        return {
          status: 200,
          content: documents
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading documents: ${error}`
        };
      }
    }
  }),
  documentsGet: tool({
    description: 'Get an specific document.',
    inputSchema: z.object({
      id: z.string().describe('The ID of the document.')
    }),
    async execute({ id }) {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain the Document
        const document = await client.query(api.documents.get, { id });

        // Return the Document
        if (!document) {
          return {
            status: 200,
            content: 'No document found.'
          };
        }
        return {
          status: 200,
          content: {
            ...document,
            content: tiptapToMarkdown(document.content)
          }
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading document: ${error}`
        };
      }
    }
  }),
  whiteboardsList: tool({
    description: 'List all whiteboards.',
    inputSchema: z.object(),
    async execute() {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain all Whiteboards
        const whiteboards = await client.query(api.whiteboards.list);

        // Return all Whiteboards
        if (!whiteboards || whiteboards.length === 0) {
          return {
            status: 200,
            content: 'No whiteboards found.'
          };
        }
        return {
          status: 200,
          content: whiteboards
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading whiteboards: ${error}`
        };
      }
    }
  }),
  whiteboardsGet: tool({
    description: 'Get an specific whiteboard.',
    inputSchema: z.object({
      id: z.string().describe('The ID of the whiteboard.')
    }),
    async execute({ id }) {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain the Whiteboard
        const whiteboard = await client.query(api.whiteboards.get, { id });

        // Return the Whiteboard
        if (!whiteboard) {
          return {
            status: 200,
            content: 'No whiteboard found.'
          };
        }
        return {
          status: 200,
          content: whiteboard
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading whiteboard: ${error}`
        };
      }
    }
  }),
  multimediaList: tool({
    description: 'List all media files.',
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
  multimediaGet: tool({
    description: 'Get an specific media file.',
    inputSchema: z.object({
      id: z.string().describe('The ID of the media file.')
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
  }),
  resourcesList: tool({
    description: `List all resources.`,
    inputSchema: z.object(),
    async execute() {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain all Resources
        const resources = await client.query(api.resources.list, {});

        // Return all Resources
        if (!resources || resources.length === 0) {
          return {
            status: 200,
            content: 'No resources found.'
          };
        }
        return {
          status: 200,
          content: resources
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading resources: ${error}`
        };
      }
    }
  }),
  resourcesGet: tool({
    description: 'Get an specific resource.',
    inputSchema: z.object({
      id: z.string().describe('The ID of the resource.')
    }),
    async execute({ id }) {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain the Resource
        const resource = await client.query(api.resources.get, { id });

        // Return the Resource
        if (!resource) {
          return {
            status: 200,
            content: 'No resource found.'
          };
        }
        return {
          status: 200,
          content: resource
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading resource: ${error}`
        };
      }
    }
  }),
  usersRedirect: tool({
    description: 'Redirects the user to a specified URL inside the app.',
    inputSchema: z.object({
      section: z.enum(['/overview', '/analytics', '/meetings', '/contacts', '/companies', '/payments', '/documents', '/whiteboards', '/multimedia', '/resources']),
      id: z.string().optional().describe('ID for dynamic routes like /multimedia/[id]')
    }),
    async execute({ section, id }) {
      const path = id ? `${section}/${id}` : section;
      return {
        success: true,
        redirect: path
      };
    }
  })
};

// General Types
export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

// Tools Types
export type MeetingsListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-meetingsList' }>;
export type MeetingsGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-meetingsGet' }>;
export type DocumentsListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-documentsList' }>;
export type DocumentsGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-documentsGet' }>;
export type WhiteboardsListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-whiteboardsList' }>;
export type WhiteboardsGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-whiteboardsGet' }>;
export type MultimediaListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-multimediaList' }>;
export type MultimediaGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-multimediaGet' }>;
export type ResourcesListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-resourcesList' }>;
export type ResourcesGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-resourcesGet' }>;
export type UsersRedirectPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-usersRedirect' }>;

export type ToolParts = MeetingsListPart | MeetingsGetPart | DocumentsListPart | DocumentsGetPart | WhiteboardsListPart | WhiteboardsGetPart | MultimediaListPart | MultimediaGetPart | ResourcesListPart | ResourcesGetPart;
