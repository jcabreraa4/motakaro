import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>
        <Link href="/documents">Documents</Link>
      </nav>
      {children}
    </div>
  );
}
