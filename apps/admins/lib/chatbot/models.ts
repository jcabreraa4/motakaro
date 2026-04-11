export const chefs = ['OpenAI', 'Google', 'Mistral'];

export const initialModel = 'mistral-large-latest';

export const models = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    chef: 'OpenAI',
    chefSlug: 'openai',
    providers: [],
    useTools: true,
    webSearch: false
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    chef: 'Google',
    chefSlug: 'google',
    providers: [],
    useTools: false,
    webSearch: true
  },
  {
    id: 'mistral-large-latest',
    name: 'Mistral Large Latest',
    chef: 'Mistral',
    chefSlug: 'mistral',
    providers: [],
    useTools: true,
    webSearch: false
  }
];

export type ModelId = (typeof models)[number]['id'];
