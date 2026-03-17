export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="w-full overflow-hidden p-3 lg:p-5">
      <p>
        <span className="font-semibold">Meeting: </span>
        {id}
      </p>
    </main>
  );
}
