/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as companies from "../companies.js";
import type * as contacts from "../contacts.js";
import type * as documents from "../documents.js";
import type * as embeddings from "../embeddings.js";
import type * as employees from "../employees.js";
import type * as http from "../http.js";
import type * as meetings from "../meetings.js";
import type * as memberships from "../memberships.js";
import type * as multimedia from "../multimedia.js";
import type * as prosemirror from "../prosemirror.js";
import type * as resources from "../resources.js";
import type * as whiteboards from "../whiteboards.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  companies: typeof companies;
  contacts: typeof contacts;
  documents: typeof documents;
  embeddings: typeof embeddings;
  employees: typeof employees;
  http: typeof http;
  meetings: typeof meetings;
  memberships: typeof memberships;
  multimedia: typeof multimedia;
  prosemirror: typeof prosemirror;
  resources: typeof resources;
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
  prosemirrorSync: import("@convex-dev/prosemirror-sync/_generated/component.js").ComponentApi<"prosemirrorSync">;
};
