import type { Resource } from '@workspace/backend/schema';

export function ResourcesToolbar({ resource }: { resource: Resource }) {
  return (
    <section className="flex h-9 w-full items-center">
      <p className="text-lg font-semibold">Resources Toolbar: {resource.name}</p>
    </section>
  );
}
