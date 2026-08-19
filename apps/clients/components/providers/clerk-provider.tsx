import { ClerkProvider as ClerkNextjsProvider } from '@clerk/nextjs';

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkNextjsProvider
      taskUrls={{
        'choose-organization': '/org-selection'
      }}
    >
      {children}
    </ClerkNextjsProvider>
  );
}
