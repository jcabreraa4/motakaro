import prosemirrorSync from '@convex-dev/prosemirror-sync/convex.config';
import r2 from '@convex-dev/r2/convex.config';
import { defineApp } from 'convex/server';

const app = defineApp();

app.use(r2);
app.use(prosemirrorSync);

export default app;
