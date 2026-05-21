import { auth } from '@clerk/nextjs/server';
import type { InferUITools, ToolUIPart, UIDataTypes, UIMessage } from 'ai';
import { tool } from 'ai';
import { ConvexHttpClient } from 'convex/browser';
import { z } from 'zod';

import { api } from '@workspace/backend/_generated/api';
import type { Id } from '@workspace/backend/_generated/dataModel';

import { tiptapToMarkdown } from '@/lib/documents/tiptap-to-markdown';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const tools = {
  // Meetings Tools
  meetingsList: tool({
    description: 'List all meetings.',
    inputSchema: z.object(),
    async execute() {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain Meetings
        const meetings = await client.query(api.meetings.list);

        // Return Meetings
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

        // Obtain Meeting
        const meeting = await client.query(api.meetings.get, { id: id as Id<'meetings'> });

        // Return Meeting
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

  // Contacts Tools
  contactsList: tool({
    description: 'List all contacts.',
    inputSchema: z.object(),
    async execute() {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain Contacts
        const contacts = await client.query(api.contacts.list, {});

        // Return Contacts
        if (!contacts || contacts.length === 0) {
          return {
            status: 200,
            content: 'No contacts found.'
          };
        }
        return {
          status: 200,
          content: contacts
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading contacts: ${error}`
        };
      }
    }
  }),
  contactsGet: tool({
    description: 'Get an specificcontact.',
    inputSchema: z.object({
      id: z.string().describe('The ID of the contact.')
    }),
    async execute({ id }) {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain Contact
        const contact = await client.query(api.contacts.get, { id: id as Id<'contacts'> });

        // Return Contact
        if (!contact) {
          return {
            status: 200,
            content: 'No contact found.'
          };
        }
        return {
          status: 200,
          content: contact
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading contact: ${error}`
        };
      }
    }
  }),

  // Companies Tools
  companiesList: tool({
    description: 'List all companies.',
    inputSchema: z.object(),
    async execute() {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain Companies
        const companies = await client.query(api.companies.list);

        // Return Companies
        if (!companies || companies.length === 0) {
          return {
            status: 200,
            content: 'No companies found.'
          };
        }
        return {
          status: 200,
          content: companies
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading companies: ${error}`
        };
      }
    }
  }),
  companiesGet: tool({
    description: 'Get an specific company.',
    inputSchema: z.object({
      id: z.string().describe('The ID of the company.')
    }),
    async execute({ id }) {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain Company
        const company = await client.query(api.companies.get, { id: id as Id<'companies'> });

        // Return Company
        if (!company) {
          return {
            status: 200,
            content: 'No company found.'
          };
        }
        return {
          status: 200,
          content: company
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading company: ${error}`
        };
      }
    }
  }),

  // Documents Tools
  documentsList: tool({
    description: 'List all documents.',
    inputSchema: z.object({
      company: z.union([z.literal('motakaro'), z.string().min(1)]).describe('Enter "motakaro" for Motakaro documents, or a company ID to filter by company.')
    }),
    async execute({ company }) {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain Documents
        const documents = await client.query(api.documents.list, { companyId: company === 'motakaro' ? undefined : (company as Id<'companies'>) });

        // Return Documents
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

        // Obtain Document
        const document = await client.query(api.documents.get, { id: id as Id<'documents'> });

        // Return Document
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

  // Whiteboards Tools
  whiteboardsList: tool({
    description: 'List all whiteboards.',
    inputSchema: z.object({
      company: z.union([z.literal('motakaro'), z.string().min(1)]).describe('Enter "motakaro" for Motakaro whiteboards, or a company ID to filter by company.')
    }),
    async execute({ company }) {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain Whiteboards
        const whiteboards = await client.query(api.whiteboards.list, { companyId: company === 'motakaro' ? undefined : (company as Id<'companies'>) });

        // Return Whiteboards
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

        // Obtain Whiteboard
        const whiteboard = await client.query(api.whiteboards.get, { id: id as Id<'whiteboards'> });

        // Return Whiteboard
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

  // Multimedia Tools
  multimediaList: tool({
    description: 'List all media files.',
    inputSchema: z.object({
      company: z.union([z.literal('motakaro'), z.string().min(1)]).describe('Enter "motakaro" for Motakaro media files, or a company ID to filter by company.')
    }),
    async execute({ company }) {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain Multimedia
        const multimedia = await client.query(api.multimedia.list, { companyId: company === 'motakaro' ? undefined : (company as Id<'companies'>) });

        // Return Multimedia
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

        // Obtain Media File
        const multimedia = await client.query(api.multimedia.get, { id: id as Id<'multimedia'> });

        // Return Media File
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

  // Resources Tools
  resourcesList: tool({
    description: `List all resources.`,
    inputSchema: z.object(),
    async execute() {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain Resources
        const resources = await client.query(api.resources.list, {});

        // Return Resources
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

        // Obtain Resource
        const resource = await client.query(api.resources.get, { id: id as Id<'resources'> });

        // Return Resource
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

  // Notifications Tools
  notificationsList: tool({
    description: `List all notifications.`,
    inputSchema: z.object(),
    async execute() {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain Notifications
        const notifications = await client.query(api.notifications.list, { limit: 8 });

        // Return Notifications
        if (!notifications || notifications.length === 0) {
          return {
            status: 200,
            content: 'No notifications found.'
          };
        }
        return {
          status: 200,
          content: notifications
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading notifications: ${error}`
        };
      }
    }
  }),
  notificationsGet: tool({
    description: 'Get an specific notification.',
    inputSchema: z.object({
      id: z.string().describe('The ID of the notification.')
    }),
    async execute({ id }) {
      try {
        // Authenticate Convex
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);

        // Obtain Notification
        const notification = await client.query(api.notifications.get, { id: id as Id<'notifications'> });

        // Return Notification
        if (!notification) {
          return {
            status: 200,
            content: 'No notification found.'
          };
        }
        return {
          status: 200,
          content: notification
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading notification: ${error}`
        };
      }
    }
  }),

  // Other Tools
  usersRedirect: tool({
    description: 'Redirects the user to a specified URL inside the app.',
    inputSchema: z.object({
      section: z.enum(['/overview', '/analytics', '/meetings', '/messages', '/contacts', '/companies', '/payments', '/documents', '/whiteboards', '/multimedia', '/resources', '/notifications', '/settings']),
      id: z.string().optional().describe('ID for dynamic routes like /multimedia/[id] (Only avaliable for /meetings, /documents, /whiteboards, /multimedia and /resources)')
    }),
    async execute({ section, id }) {
      const dynamicRoutes = ['/meetings', '/documents', '/whiteboards', '/multimedia', '/resources'];
      const isDynamic = dynamicRoutes.includes(section);
      const path = isDynamic && id ? `${section}/${id}` : section;
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

// Meetings Tools
export type MeetingsListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-meetingsList' }>;
export type MeetingsGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-meetingsGet' }>;

// Contacts Tools
export type ContactsListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-contactsList' }>;
export type ContactsGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-contactsGet' }>;

// Companies Tools
export type CompaniesListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-companiesList' }>;
export type CompaniesGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-companiesGet' }>;

// Documents Tools
export type DocumentsListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-documentsList' }>;
export type DocumentsGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-documentsGet' }>;

// Whiteboards Tools
export type WhiteboardsListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-whiteboardsList' }>;
export type WhiteboardsGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-whiteboardsGet' }>;

// Multimedia Tools
export type MultimediaListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-multimediaList' }>;
export type MultimediaGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-multimediaGet' }>;

// Resources Tools
export type ResourcesListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-resourcesList' }>;
export type ResourcesGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-resourcesGet' }>;

// Notifications Tools
export type NotificationsListPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-notificationsList' }>;
export type NotificationsGetPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-notificationsGet' }>;

// Other Tools
export type UsersRedirectPart = Extract<ToolUIPart<ChatTools>, { type: 'tool-usersRedirect' }>;

export type ToolParts = MeetingsListPart | MeetingsGetPart | ContactsListPart | ContactsGetPart | CompaniesListPart | CompaniesGetPart | DocumentsListPart | DocumentsGetPart | WhiteboardsListPart | WhiteboardsGetPart | MultimediaListPart | MultimediaGetPart | ResourcesListPart | ResourcesGetPart | NotificationsListPart | NotificationsGetPart;
