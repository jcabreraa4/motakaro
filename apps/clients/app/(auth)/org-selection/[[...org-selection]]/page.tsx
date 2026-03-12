import { OrganizationList } from '@clerk/nextjs';

export default function OrgSelectView() {
  return (
    <OrganizationList
      hidePersonal
      skipInvitationScreen
      afterCreateOrganizationUrl="/overview"
      afterSelectOrganizationUrl="/overview"
    />
  );
}
