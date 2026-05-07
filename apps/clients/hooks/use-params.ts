import { parseAsString, useQueryState } from 'nuqs';

export function useParams(key: string) {
  return useQueryState(key, parseAsString.withDefault('').withOptions({ clearOnDefault: true }));
}
