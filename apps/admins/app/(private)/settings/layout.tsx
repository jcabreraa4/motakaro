import { SettingsMenu } from '@/components/settings/settings-menu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex w-full flex-col items-center overflow-hidden p-3 lg:p-5">
      <div className="flex h-full w-full max-w-5xl flex-col gap-5">
        <h2 className="hidden pt-5 text-2xl font-semibold select-none xl:block">Settings</h2>
        <div className="flex h-full flex-col gap-3 lg:flex-row lg:gap-5">
          <section className="max-h-fit min-h-fit w-full rounded-md border p-2 lg:max-w-60 lg:min-w-60">
            <SettingsMenu />
          </section>
          {children}
        </div>
      </div>
    </main>
  );
}
