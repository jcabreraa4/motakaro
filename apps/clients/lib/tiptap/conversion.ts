import { JSONContent } from '@tiptap/core';
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown';

import { extensions } from '@/lib/tiptap/extensions';

export function tiptapToMarkdown(content: string): string {
  if (!content) return '';
  return renderToMarkdown({ extensions, content: JSON.parse(content) as JSONContent });
}
