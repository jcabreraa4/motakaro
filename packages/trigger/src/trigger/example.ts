import { task } from '@trigger.dev/sdk';

export const helloFunction = task({
  id: 'hello',
  run: async (payload: { name: string }) => {
    console.log(`Hello ${payload.name}! Welcome to Motakaro.`);
    return { success: true };
  }
});
