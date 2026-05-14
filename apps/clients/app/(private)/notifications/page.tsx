'use client';

import { useAuth } from '@clerk/nextjs';
import { XIcon, SearchIcon } from 'lucide-react';
import { NotificationsLoader } from '@/components/notifications/notifications-loader';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { NotificationsTable } from '@/components/notifications/notifications-table';
import { api } from '@workspace/backend/_generated/api';
import { useParams } from '@/hooks/use-params';
import { useQuery } from 'convex/react';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');

  const notifications = useQuery(api.notifications.clientsList, isLoaded ? {} : 'skip');
  const filteredNotifications = notifications?.filter((file) => searchFilter === '' || file.name.toLowerCase().includes(searchFilter.toLowerCase()) || file.note.toLowerCase().includes(searchFilter.toLowerCase()) || file.content.toLowerCase().includes(searchFilter.toLowerCase()) || file._id.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <main className="flex w-full flex-col items-center gap-2 overflow-hidden p-3 lg:p-5">
      <div className="flex h-full w-full max-w-5xl flex-col gap-5">
        <h2 className="hidden pt-5 text-2xl font-semibold select-none xl:block">Notifications</h2>
        <section className="flex flex-col gap-3 lg:flex-row lg:gap-5">
          <InputGroup>
            <InputGroupInput
              disabled={!notifications || notifications.length === 0}
              placeholder="Search..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            {searchFilter && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-sm"
                  className="cursor-pointer"
                  onClick={() => setSearchFilter('')}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </section>
        {!notifications ? (
          <NotificationsLoader />
        ) : notifications.length === 0 ? (
          <div className="rounded-md border bg-sidebar p-5 select-none">
            <p className="font-medium">There are no notifications!</p>
          </div>
        ) : filteredNotifications?.length === 0 ? (
          <div className="rounded-md border bg-sidebar p-5 select-none">
            <p className="font-medium">No notifications match your search criteria.</p>
          </div>
        ) : (
          <NotificationsTable notifications={filteredNotifications || []} />
        )}
      </div>
    </main>
  );
}
