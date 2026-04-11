import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from '@workspace/ui/chatbot/tool';
import type { ListMultimediaPart, GetMultimediaPart } from '@/app/api/chatbot/tools';
import { MultimediaPreview } from '@/components/multimedia/multimedia-preview';
import { CodeBlock } from '@workspace/ui/chatbot/code-block';

export function ListMultimedia({ part }: { part: ListMultimediaPart }) {
  return (
    <Tool>
      <ToolHeader
        type={part.type}
        state={part.state}
        className="cursor-pointer select-none"
      />
      <ToolContent>
        {part.state === 'output-available' && (
          <ToolOutput
            output={
              <CodeBlock
                code={JSON.stringify(part.output, null, 2)}
                language="json"
              />
            }
            errorText={part.errorText}
          />
        )}
      </ToolContent>
    </Tool>
  );
}

export function GetMultimedia({ part }: { part: GetMultimediaPart }) {
  return (
    <div>
      <Tool>
        <ToolHeader
          type={part.type}
          state={part.state}
          className="cursor-pointer"
        />
        <ToolContent>
          <ToolInput input={part.input} />
          {part.state === 'output-available' && (
            <ToolOutput
              output={
                <CodeBlock
                  code={JSON.stringify(part.output, null, 2)}
                  language="json"
                />
              }
              errorText={part.errorText}
            />
          )}
        </ToolContent>
      </Tool>
      {part.state === 'output-available' && typeof part.output.content === 'object' && 'url' in part.output.content && (
        <MultimediaPreview
          preview
          id={part.output.content._id}
          src={part.output.content.url}
          name={part.output.content.name}
          type={part.output.content.type}
        />
      )}
    </div>
  );
}
