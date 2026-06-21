/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admins from "../admins.js";
import type * as agents from "../agents.js";
import type * as auth from "../auth.js";
import type * as clients from "../clients.js";
import type * as documents from "../documents.js";
import type * as env from "../env.js";
import type * as http from "../http.js";
import type * as meetings from "../meetings.js";
import type * as memberships from "../memberships.js";
import type * as messages from "../messages.js";
import type * as multimedia from "../multimedia.js";
import type * as notifications from "../notifications.js";
import type * as organizations from "../organizations.js";
import type * as prosemirror from "../prosemirror.js";
import type * as resources from "../resources.js";
import type * as threads from "../threads.js";
import type * as whiteboards from "../whiteboards.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admins: typeof admins;
  agents: typeof agents;
  auth: typeof auth;
  clients: typeof clients;
  documents: typeof documents;
  env: typeof env;
  http: typeof http;
  meetings: typeof meetings;
  memberships: typeof memberships;
  messages: typeof messages;
  multimedia: typeof multimedia;
  notifications: typeof notifications;
  organizations: typeof organizations;
  prosemirror: typeof prosemirror;
  resources: typeof resources;
  threads: typeof threads;
  whiteboards: typeof whiteboards;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  agent: import("@convex-dev/agent/_generated/component.js").ComponentApi<"agent">;
  prosemirrorSync: import("@convex-dev/prosemirror-sync/_generated/component.js").ComponentApi<"prosemirrorSync">;
};
