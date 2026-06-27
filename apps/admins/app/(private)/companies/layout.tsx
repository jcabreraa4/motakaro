export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>Documents</nav>
      {children}
    </div>
  );
}
