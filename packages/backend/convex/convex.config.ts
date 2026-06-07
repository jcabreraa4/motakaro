import agent from '@convex-dev/agent/convex.config';
import prosemirrorSync from '@convex-dev/prosemirror-sync/convex.config.js';
import { defineApp } from 'convex/server';

const app = defineApp();

app.use(agent);
app.use(prosemirrorSync);

export default app;
