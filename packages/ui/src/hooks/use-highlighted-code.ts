// Custom Shadcn Override
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { loadHighlighter } from '@workspace/ui/lib/highlighter';

// Highlighter Types
type Highlighter = Awaited<ReturnType<typeof loadHighlighter>>;
type HighlightState = Parameters<NonNullable<Highlighter>['highlight']>[1];

// Load Highlighter
function useHighlighter(language: string) {
  const [loaded, setLoaded] = useState<{ language: string; highlighter: Highlighter } | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadHighlighter(language)
      .then((highlighter) => {
        if (!cancelled) setLoaded({ language, highlighter });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [language]);
  return loaded?.language === language ? loaded.highlighter : null;
}

// Highlight Code
export function useHighlightedCode(value: string, language: string) {
  const code = value.endsWith('\n') ? value.slice(0, -1) : value;
  const highlighter = useHighlighter(language);

  // Done Lines
  const [done, setDone] = useState<{
    highlighter: Highlighter;
    text: string;
    lines: ReactNode[];
    state?: HighlightState;
  }>({ highlighter: null, text: '', lines: [] });

  // Reset Cache
  let next = done;
  if (next.highlighter !== highlighter || !code.startsWith(next.text)) {
    next = { highlighter, text: '', lines: [] };
  }

  // Tokenize New Lines
  const end = code.lastIndexOf('\n') + 1;
  if (highlighter && end > next.text.length) {
    const result = highlighter.highlight(code.slice(next.text.length, end - 1), next.state);
    next = {
      highlighter,
      text: code.slice(0, end),
      lines: [...next.lines, ...result.lines],
      state: result.state
    };
  }

  if (next !== done) setDone(next);
  const tail = code.slice(end);

  // Return Lines
  return useMemo(() => {
    if (!highlighter) return code.split('\n');
    return [...next.lines, highlighter.highlight(tail, next.state).lines[0]];
  }, [code, highlighter, next, tail]);
}
