import { ModelSelector, ModelSelectorContent, ModelSelectorEmpty, ModelSelectorGroup, ModelSelectorInput, ModelSelectorItem, ModelSelectorList, ModelSelectorLogo, ModelSelectorLogoGroup, ModelSelectorName, ModelSelectorTrigger } from '@workspace/ui/chatbot/model-selector';
import { PromptInputButton } from '@workspace/ui/chatbot/prompt-input';
import { type ModelId, models, chefs } from '@/lib/chatbot/models';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

interface ChatbotDialogProps {
  chatModel: ModelId;
  setChatModel: (value: ModelId) => void;
}

export function ChatbotDialog({ chatModel, setChatModel }: ChatbotDialogProps) {
  const [open, setOpen] = useState(false);

  const selectedModel = models.find((m) => m.id === chatModel);

  function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <ModelSelector
      open={open}
      onOpenChange={setOpen}
    >
      <ModelSelectorTrigger
        asChild
        className="cursor-pointer truncate"
      >
        <PromptInputButton variant="ghost">
          {selectedModel?.chefSlug && <ModelSelectorLogo provider={selectedModel.chefSlug} />}
          {selectedModel?.name && <ModelSelectorName className="hidden lg:block">{selectedModel.name}</ModelSelectorName>}
          {selectedModel?.chefSlug && <ModelSelectorName className="lg:hidden">{capitalize(selectedModel.chefSlug)}</ModelSelectorName>}
          <ChevronDownIcon />
        </PromptInputButton>
      </ModelSelectorTrigger>
      <ModelSelectorContent>
        <ModelSelectorInput placeholder="Search models..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          {chefs.map((chef) => (
            <ModelSelectorGroup
              key={chef}
              heading={chef}
            >
              {models
                .filter((model) => model.chef === chef)
                .map((model) => (
                  <ModelSelectorItem
                    key={model.id}
                    onSelect={() => {
                      setChatModel(model.id);
                      setOpen(false);
                    }}
                    value={model.id}
                  >
                    <ModelSelectorLogo provider={model.chefSlug} />
                    <ModelSelectorName>{model.name}</ModelSelectorName>
                    <ModelSelectorLogoGroup>
                      {model.providers.map((provider) => (
                        <ModelSelectorLogo
                          key={provider}
                          provider={provider}
                        />
                      ))}
                    </ModelSelectorLogoGroup>
                    {chatModel === model.id ? <CheckIcon className="ml-auto size-4" /> : <div className="ml-auto size-4" />}
                  </ModelSelectorItem>
                ))}
            </ModelSelectorGroup>
          ))}
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
}
