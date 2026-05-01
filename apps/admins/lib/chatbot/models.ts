export const chefs = ['Mistral', 'OpenAI'];
export const defaultModel = 'gpt-4o-mini';

type Model = {
  id: string;
  name: string;
  chef: 'OpenAI' | 'Mistral';
  chefSlug: 'openai' | 'mistral';
  providers: string[];
};

export const models: Model[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    chef: 'OpenAI',
    chefSlug: 'openai',
    providers: []
  },
  {
    id: 'mistral-large-latest',
    name: 'Mistral Large',
    chef: 'Mistral',
    chefSlug: 'mistral',
    providers: []
  }
];

export type ModelId = (typeof models)[number]['id'];
