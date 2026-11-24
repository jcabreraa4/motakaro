import { localDev, placeholderAuth, vercelOidc } from 'eve/channels/auth';
import { eveChannel } from 'eve/channels/eve';

import { env } from '@/env';

const origin = env.CORS_ORIGINS.split(',');

export default eveChannel({
  auth: [
    // TUI and Vercel
    vercelOidc(),
    // Dev Localhost
    localDev(),
    // Auth Provider
    placeholderAuth()
  ],
  cors: {
    origin,
    methods: ['GET', 'POST'],
    allowHeaders: ['authorization', 'content-type']
  }
});
