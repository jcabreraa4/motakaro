import { defineConfig } from '@trigger.dev/sdk';

const project = 'proj_ymgrrxhllckcsupcajsf';

export default defineConfig({
  project,
  runtime: 'bun-1.4',
  dirs: ['./src/trigger'],
  maxDuration: 300
});
