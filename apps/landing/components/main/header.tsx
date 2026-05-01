import { PlaybookButton } from '@/components/motakaro/playbook-button';
import { ActionButton } from '@/components/motakaro/action-button';
import { VideoDialog } from '@workspace/ui/magicui/video-dialog';

export function Header() {
  return (
    <header className="container mx-auto px-3 py-20 xl:px-5">
      <section className="flex flex-col gap-10 xl:flex-row xl:gap-0">
        <div className="flex w-full flex-col justify-center gap-8 xl:w-2/4">
          <h1 className="max-w-2xl text-5xl font-black">DEMAND GENERATION THROUGH LINKEDIN ADS</h1>
          <h2 className="max-w-3xl text-3xl font-bold">Become an industry reference with strategic content and optimized ads.</h2>
          <h3 className="max-w-2xl text-2xl font-medium">GTM strategy based on audience targeting and education on LinkedIn, with ads designed to attract your ICP and generate real buying intent signals.</h3>
          <div className="flex gap-6">
            <ActionButton />
            <PlaybookButton />
          </div>
        </div>
        <VideoDialog
          video=""
          thumbnail="/header.webp"
          animation="from-center"
          className="w-full xl:w-2/4"
        />
      </section>
    </header>
  );
}
