import mcp from '@convex-dev/mcp/convex.config.js';
import prosemirrorSync from '@convex-dev/prosemirror-sync/convex.config';
import r2 from '@convex-dev/r2/convex.config';
import resend from '@convex-dev/resend/convex.config.js';
import trigger from '@trigger.dev/convex/convex.config.js';
import { defineApp } from 'convex/server';

const app = defineApp();

app.use(mcp);
app.use(prosemirrorSync);
app.use(r2);
app.use(resend);
app.use(trigger);

export default app;
