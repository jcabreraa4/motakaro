const playbookUrl = 'https://gamma.app/embed/fuh749h0yorr3wm';

export default function Page() {
  return (
    <main className="container mx-auto flex flex-1 flex-col px-3 py-8 xl:px-5">
      <iframe
        src={playbookUrl}
        allow="fullscreen"
        title="Motakaro Playbook"
        className="w-full flex-1 rounded-md bg-black select-none"
      />
    </main>
  );
}
