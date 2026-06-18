import Link from 'next/link';

import { CodeBlock } from '@workspace/ui/chatbot/code-block';
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from '@workspace/ui/chatbot/tool';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@workspace/ui/components/carousel';

import type { CompaniesGetPart, CompaniesListPart, ContactsGetPart, ContactsListPart, DocumentsGetPart, DocumentsListPart, MeetingsGetPart, MeetingsListPart, MultimediaGetPart, MultimediaListPart, NotificationsGetPart, NotificationsListPart, ResourcesGetPart, ResourcesListPart, ToolParts, WhiteboardsGetPart, WhiteboardsListPart } from '@/app/api/chatbot/tools';
import { MultimediaInfo } from '@/components/multimedia/multimedia-info';
import { MultimediaPreview } from '@/components/multimedia/multimedia-preview';
import { useChatbot } from '@/hooks/use-chatbot';

interface ToolCodeBlockProps {
  part: ToolParts;
  title: string;
  input?: boolean;
}

function ToolCodeBlock({ part, title, input = false }: ToolCodeBlockProps) {
  return (
    <Tool>
      <ToolHeader
        title={title}
        type={part.type}
        state={part.state}
        className="cursor-pointer select-none"
      />
      <ToolContent>
        {input && <ToolInput input={part.input} />}
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

// Meetings Tools
export function MeetingsList({ part }: { part: MeetingsListPart }) {
  return (
    <div>
      <ToolCodeBlock
        part={part}
        title="List Meetings"
      />
    </div>
  );
}

export function MeetingsGet({ part }: { part: MeetingsGetPart }) {
  return (
    <div>
      <ToolCodeBlock
        input
        part={part}
        title="Get Meeting"
      />
    </div>
  );
}

// Contacts Tools
export function ContactsList({ part }: { part: ContactsListPart }) {
  return (
    <div>
      <ToolCodeBlock
        part={part}
        title="List Contacts"
      />
    </div>
  );
}

export function ContactsGet({ part }: { part: ContactsGetPart }) {
  return (
    <div>
      <ToolCodeBlock
        input
        part={part}
        title="Get Contact"
      />
    </div>
  );
}

// Companies Tools
export function CompaniesList({ part }: { part: CompaniesListPart }) {
  return (
    <div>
      <ToolCodeBlock
        part={part}
        title="List Companies"
      />
    </div>
  );
}

export function CompaniesGet({ part }: { part: CompaniesGetPart }) {
  return (
    <div>
      <ToolCodeBlock
        input
        part={part}
        title="Get Company"
      />
    </div>
  );
}

// Documents Tools
export function DocumentsList({ part }: { part: DocumentsListPart }) {
  return (
    <div>
      <ToolCodeBlock
        part={part}
        title="List Documents"
      />
    </div>
  );
}

export function DocumentsGet({ part }: { part: DocumentsGetPart }) {
  return (
    <div>
      <ToolCodeBlock
        input
        part={part}
        title="Get Document"
      />
    </div>
  );
}

// Whiteboards Tools
export function WhiteboardsList({ part }: { part: WhiteboardsListPart }) {
  return (
    <div>
      <ToolCodeBlock
        part={part}
        title="List Whiteboards"
      />
    </div>
  );
}

export function WhiteboardsGet({ part }: { part: WhiteboardsGetPart }) {
  return (
    <div>
      <ToolCodeBlock
        input
        part={part}
        title="Get Whiteboard"
      />
    </div>
  );
}

// Multimedia Tools
export function MultimediaList({ part }: { part: MultimediaListPart }) {
  const { handleChatbot } = useChatbot();

  return (
    <div>
      <ToolCodeBlock
        part={part}
        title="List Multimedia"
      />
      {part.state === 'output-available' && typeof part.output.content === 'object' && (
        <div className="w-full pb-14">
          <Carousel>
            <CarouselContent>
              {part.output.content.map((file, index) => (
                <CarouselItem key={index}>
                  <div className="flex flex-col gap-5">
                    <Link
                      onClick={handleChatbot}
                      href={`/multimedia/${file._id}`}
                    >
                      <MultimediaPreview
                        src={file.url!}
                        type={file.type}
                        className="cursor-pointer"
                      />
                    </Link>
                    <MultimediaInfo
                      name={file.name}
                      size={file.size}
                      type={file.type}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="mt-42 ml-12 rounded-md px-12" />
            <CarouselNext className="mt-42 mr-12 rounded-md px-12" />
          </Carousel>
        </div>
      )}
    </div>
  );
}

export function MultimediaGet({ part }: { part: MultimediaGetPart }) {
  const { handleChatbot } = useChatbot();

  return (
    <div>
      <ToolCodeBlock
        input
        part={part}
        title="Get Multimedia"
      />
      {part.state === 'output-available' && typeof part.output.content === 'object' && (
        <div className="flex flex-col gap-5">
          <Link
            onClick={handleChatbot}
            href={`/multimedia/${part.output.content._id}`}
          >
            <MultimediaPreview
              src={part.output.content.url}
              type={part.output.content.type}
              className="cursor-pointer"
            />
          </Link>
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

// Resources Tools
export function ResourcesList({ part }: { part: ResourcesListPart }) {
  return (
    <div>
      <ToolCodeBlock
        part={part}
        title="List Resources"
      />
    </div>
  );
}

export function ResourcesGet({ part }: { part: ResourcesGetPart }) {
  return (
    <div>
      <ToolCodeBlock
        input
        part={part}
        title="Get Resource"
      />
    </div>
  );
}

// Notifications Tools
export function NotificationsList({ part }: { part: NotificationsListPart }) {
  return (
    <div>
      <ToolCodeBlock
        part={part}
        title="List Notifications"
      />
    </div>
  );
}

export function NotificationsGet({ part }: { part: NotificationsGetPart }) {
  return (
    <div>
      <ToolCodeBlock
        input
        part={part}
        title="Get Notification"
      />
    </div>
  );
}
