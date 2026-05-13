'use client';

import { useAuth } from '@clerk/nextjs';
import { useParams } from '@/hooks/use-params';
import { api } from '@workspace/backend/_generated/api';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { NotificationsTable } from '@/components/notifications/notifications-table';
import { SearchIcon } from 'lucide-react';
import { useQuery } from 'convex/react';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');
  const [typeFilter, setTypeFilter] = useParams('type');
  const effectiveTypeFilter = typeFilter || 'all';

  const notifications = useQuery(api.notifications.clientsList, isLoaded ? {} : 'skip');
  const filteredNotifications = notifications?.filter((file) => searchFilter === '' || file.name.toLowerCase().includes(searchFilter.toLowerCase()) || file.note.toLowerCase().includes(searchFilter.toLowerCase()) || file.content.toLowerCase().includes(searchFilter.toLowerCase()) || file._id.toLowerCase().includes(searchFilter.toLowerCase())).filter((file) => (effectiveTypeFilter === 'all' ? true : file.type.includes(effectiveTypeFilter)));

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
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="reminder">Reminders</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </section>
        <NotificationsTable notifications={filteredNotifications || []} />
      </div>
    </main>
  );
}
