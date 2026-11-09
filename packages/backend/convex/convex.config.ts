import prosemirrorSync from '@convex-dev/prosemirror-sync/convex.config';
import r2 from '@convex-dev/r2/convex.config';
import rateLimiter from '@convex-dev/rate-limiter/convex.config.js';
import resend from '@convex-dev/resend/convex.config.js';
import trigger from '@trigger.dev/convex/convex.config.js';
import { defineApp } from 'convex/server';

const app = defineApp();

app.use(prosemirrorSync);
app.use(r2);
app.use(rateLimiter);
app.use(resend);
app.use(trigger);

export default app;
