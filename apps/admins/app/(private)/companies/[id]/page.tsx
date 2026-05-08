import type { Id } from '@workspace/backend/_generated/dataModel';

export default async function Page({ params }: { params: Promise<{ id: Id<'companies'> }> }) {
  const { id } = await params;

  return (
    <main className="w-full overflow-hidden p-3 lg:p-5">
      <p>
        <span className="font-semibold">Company: </span>
        {id}
      </p>
    </main>
  );
}
