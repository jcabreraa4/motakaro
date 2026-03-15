import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import type { WebhookEvent } from '@clerk/backend';
import { Webhook } from 'svix';

const http = httpRouter();

http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) return new Response('Error occurred', { status: 400 });
    if (event.type === 'organization.created' || event.type === 'organization.updated') {
      await ctx.runMutation(internal.companies.upsert, {
        name: event.data.name,
        logo: event.data.image_url ?? undefined,
        clerkId: event.data.id
      });
    } else if (event.type === 'organization.deleted') {
      await ctx.runMutation(internal.companies.remove, {
        clerkId: event.data.id!
      });
    } else if (event.type === 'user.created' || event.type === 'user.updated') {
      await ctx.runMutation(internal.contacts.upsert, {
        name: event.data.first_name ?? undefined,
        surname: event.data.last_name ?? undefined,
        email: event.data.email_addresses[0]?.email_address ?? '',
        avatar: event.data.image_url ?? undefined,
        clerkId: event.data.id
      });
    } else if (event.type === 'user.deleted') {
      await ctx.runMutation(internal.contacts.remove, {
        clerkId: event.data.id!
      });
    }
    return new Response(null, { status: 200 });
  })
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadStr = await req.text();
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) return null;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadStr, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    }) as WebhookEvent;
  } catch {
    return null;
  }
}

export default http;
