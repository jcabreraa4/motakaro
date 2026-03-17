import { Blackboard } from '@workspace/backend/schema';
import { useRouter } from 'next/navigation';

export function BoardsTable({ blackboards }: { blackboards: Blackboard[] }) {
  const router = useRouter();

  return (
    <section className="flex w-full flex-col gap-3">
      {blackboards.map((board) => (
        <div
          key={board._id}
          className="cursor-pointer rounded-lg border border-black p-2 hover:bg-primary hover:text-white"
          onClick={() => router.push(`/blackboards/${board._id}`)}
        >
          {board.name}
        </div>
      ))}
    </section>
  );
}
