import { task } from '@trigger.dev/sdk/v3';

export const helloFunction = task({
  id: 'hello-function',
  run: async (payload: { name: string }) => {
    return `Hello ${payload.name}! Welcome to Motakaro.`;
  }
});
