import { AuthLayout } from '@workspace/ui/components/custom/auth-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
