import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown';
import { tiptapExtensions } from '@/lib/documents/tiptap';
import { JSONContent } from '@tiptap/core';

export function tiptapToMarkdown(content: string): string {
  if (!content) return '';
  return renderToMarkdown({ extensions: tiptapExtensions, content: JSON.parse(content) as JSONContent });
}
