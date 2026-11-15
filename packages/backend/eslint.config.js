import { config } from '@workspace/eslint/base';

export default [
  ...config,
  {
    ignores: ['convex/_generated/**']
  }
];
