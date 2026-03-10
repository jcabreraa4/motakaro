'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';

export default function Page() {
  const users = useQuery(api.users.getMany);
  const create = useMutation(api.users.addUser);

  return (
    <main className="flex min-h-svh flex-col gap-3 p-6">
      <h1 className="text-xl font-bold">Admins App</h1>
      <Button
        className="max-w-60 cursor-pointer"
        onClick={() => create()}
      >
        Create User
      </Button>
      <div className="flex flex-col gap-3 font-medium">
        {users?.map((user, index) => (
          <p key={index}>{user.name}</p>
        ))}
      </div>
    </main>
  );
}
