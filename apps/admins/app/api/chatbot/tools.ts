import type { InferUITools, ToolUIPart, UIDataTypes, UIMessage } from 'ai';
import { tool } from 'ai';
import type { ConvexHttpClient } from 'convex/browser';
import { z } from 'zod';

import { api } from '@workspace/backend/_generated/api';
import type { Id } from '@workspace/backend/_generated/dataModel';

import { tiptapToMarkdown } from '@/lib/documents/tiptap-to-markdown';

export function chatbotTools(convex: ConvexHttpClient) {
  return {
    // Meetings Tools
    meetingsList: tool({
      description: 'List all meetings.',
      inputSchema: z.object(),
      async execute() {
        try {
          // Obtain Meetings
          const meetings = await convex.query(api.meetings.list, {});

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
          // Obtain Meeting
          const meeting = await convex.query(api.meetings.get, { id });

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
          // Obtain Contacts
          const contacts = await convex.query(api.clients.list, {});

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
          // Obtain Contact
          const contact = await convex.query(api.clients.get, { id });

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

    // Organizations Tools
    organizationsList: tool({
      description: 'List all organizations.',
      inputSchema: z.object(),
      async execute() {
        try {
          // Obtain Organizations
          const organizations = await convex.query(api.organizations.list, {});

          // Return Organizations
          if (!organizations || organizations.length === 0) {
            return {
              status: 200,
              content: 'No organizations found.'
            };
          }
          return {
            status: 200,
            content: organizations
          };
        } catch (error) {
          return {
            status: 500,
            message: `Error loading organizations: ${error}`
          };
        }
      }
    }),
    organizationsGet: tool({
      description: 'Get an specific organization.',
      inputSchema: z.object({
        id: z.string().describe('The ID of the organization.')
      }),
      async execute({ id }) {
        try {
          // Obtain Organization
          const organization = await convex.query(api.organizations.get, { id });

          // Return Organization
          if (!organization) {
            return {
              status: 200,
              content: 'No organization found.'
            };
          }
          return {
            status: 200,
            content: organization
          };
        } catch (error) {
          return {
            status: 500,
            message: `Error loading organization: ${error}`
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
          // Obtain Documents
          const documents = await convex.query(api.documents.list, { organizationId: company === 'motakaro' ? undefined : (company as Id<'organizations'>) });

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
          // Obtain Document
          const document = await convex.query(api.documents.get, { id });

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
          // Obtain Whiteboards
          const whiteboards = await convex.query(api.whiteboards.list, { organizationId: company === 'motakaro' ? undefined : (company as Id<'organizations'>) });

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
          // Obtain Whiteboard
          const whiteboard = await convex.query(api.whiteboards.get, { id });

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
          // Obtain Multimedia
          const multimedia = await convex.query(api.multimedia.list, { organizationId: company === 'motakaro' ? undefined : (company as Id<'organizations'>) });

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
          // Obtain Media File
          const multimedia = await convex.query(api.multimedia.get, { id });

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
          // Obtain Resources
          const resources = await convex.query(api.resources.list, {});

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
          // Obtain Resource
          const resource = await convex.query(api.resources.get, { id });

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
          // Obtain Notifications
          const notifications = await convex.query(api.notifications.list, { limit: 8 });

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
          // Obtain Notification
          const notification = await convex.query(api.notifications.get, { id });

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
    userRedirect: tool({
      description: 'Redirects the user to a specified URL inside the app.',
      inputSchema: z.object({
        section: z.enum(['/overview', '/meetings', '/messages', '/contacts', '/companies', '/invoices', '/analytics', '/documents', '/whiteboards', '/multimedia', '/resources', '/notifications', '/settings']),
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
}

// General Types
export type ChatTools = InferUITools<ReturnType<typeof chatbotTools>>;
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
