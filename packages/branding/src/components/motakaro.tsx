import LogoImage from '@workspace/assets/logo.webp';

export function Motakaro() {
  return (
    <div className="pointer-events-none flex items-center gap-2 select-none">
      <img
        src={LogoImage.src}
        alt="Motakaro"
        className="size-10"
      />
      <p className="text-2xl font-semibold">Motakaro</p>
    </div>
  );
}
