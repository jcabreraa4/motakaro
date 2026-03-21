const playbookGamma = 'https://gamma.app/embed/fuh749h0yorr3wm';

export default function Playbook() {
  return (
    <main className="container mx-auto flex flex-1 flex-col px-3 py-8 xl:px-5">
      <iframe
        src={playbookGamma}
        allow="fullscreen"
        title="Motakaro Playbook"
        className="w-full flex-1 bg-black"
      />
    </main>
  );
}
