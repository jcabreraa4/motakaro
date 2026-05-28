'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { SearchIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';

import { NotificationsLoader } from '@/components/notifications/notifications-loader';
import { NotificationsTable } from '@/components/notifications/notifications-table';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');
  const [typeFilter, setTypeFilter] = useParams('filter');
  const effectiveTypeFilter = typeFilter || 'all';

  const notifications = useQuery(api.notifications.clientsList, isLoaded ? {} : 'skip');
  const filteredNotifications = notifications?.filter((file) => {
    const matchesSearch = searchFilter === '' || file.name.toLowerCase().includes(searchFilter.toLowerCase()) || file.content.toLowerCase().includes(searchFilter.toLowerCase()) || file._id.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesType = effectiveTypeFilter === 'all' || (effectiveTypeFilter === 'unread' && file.read === false) || (effectiveTypeFilter === 'important' && file.starred === true);
    return matchesSearch && matchesType;
  });

  return (
    <main className="flex w-full flex-col items-center overflow-hidden p-3 lg:p-5">
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
          <Select
            value={effectiveTypeFilter}
            onValueChange={(value) => setTypeFilter(value === 'all' ? '' : value)}
          >
            <SelectTrigger
              disabled={!notifications || notifications.length === 0}
              className="w-full min-w-50 cursor-pointer lg:max-w-50"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Unfiltered</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="important">Important</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
