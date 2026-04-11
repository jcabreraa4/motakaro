import { Suggestion, Suggestions } from '@workspace/ui/chatbot/suggestion';
import { suggestions } from '@/lib/chatbot/suggestions';

interface ChatbotSuggestionsProps {
  handleSubmit: (suggestion: string) => void;
  className?: string;
}

export function ChatbotSuggestions({ handleSubmit, className }: ChatbotSuggestionsProps) {
  return (
    <Suggestions className={className}>
      {suggestions.map((suggestion) => (
        <Suggestion
          key={suggestion}
          suggestion={suggestion}
          onClick={() => handleSubmit(suggestion)}
          className="h-9 rounded-lg"
        />
      ))}
    </Suggestions>
  );
}
