import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@workspace/ui/components/carousel';
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from '@workspace/ui/chatbot/tool';
import type { ListMultimediaPart, GetMultimediaPart } from '@/app/api/chatbot/tools';
import { MultimediaPreview } from '@/components/multimedia/multimedia-preview';
import { CodeBlock } from '@workspace/ui/chatbot/code-block';
import { MultimediaInfo } from '../multimedia/multimedia-info';

export function ListMultimedia({ part }: { part: ListMultimediaPart }) {
  return (
    <div>
      <Tool>
        <ToolHeader
          type={part.type}
          state={part.state}
          title="List Multimedia"
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
      {part.state === 'output-available' && typeof part.output.content === 'object' && (
        <div className="w-full pb-14">
          <Carousel>
            <CarouselContent>
              {part.output.content.map((file, index) => (
                <CarouselItem key={index}>
                  <MultimediaPreview
                    preview
                    id={file._id}
                    src={file.url!}
                    name={file.name}
                    type={file.type}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="mt-37 ml-12 cursor-pointer rounded-md px-12" />
            <CarouselNext className="mt-37 mr-12 cursor-pointer rounded-md px-12" />
          </Carousel>
        </div>
      )}
    </div>
  );
}

export function GetMultimedia({ part }: { part: GetMultimediaPart }) {
  return (
    <div>
      <Tool>
        <ToolHeader
          type={part.type}
          state={part.state}
          title="Get Multimedia"
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
      {part.state === 'output-available' && typeof part.output.content === 'object' && (
        <div className="flex flex-col gap-5">
          <MultimediaPreview
            preview
            id={part.output.content._id}
            src={part.output.content.url}
            name={part.output.content.name}
            type={part.output.content.type}
          />
          <MultimediaInfo
            name={part.output.content.name}
            size={part.output.content.size}
            type={part.output.content.type}
          />
        </div>
      )}
    </div>
  );
}
