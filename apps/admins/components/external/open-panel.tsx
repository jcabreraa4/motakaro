import { OpenPanelComponent } from '@openpanel/nextjs';

const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!;

export function OpenPanel() {
  return (
    <OpenPanelComponent
      apiUrl="/api/op"
      scriptUrl="/api/op/op1.js"
      clientId={clientId}
      trackScreenViews={true}
      trackOutgoingLinks={true}
    />
  );
}
