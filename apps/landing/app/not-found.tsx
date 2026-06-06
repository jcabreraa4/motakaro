import { GenericError } from '@workspace/ui/custom/generic-error';

import { Branding } from '@/components/motakaro/branding';

export default function NotFound() {
  return (
    <GenericError
      code={404}
      text="Page not found"
    >
      <div className="fixed top-0 left-0 z-50 p-5 xl:p-8">
        <Branding />
      </div>
    </GenericError>
  );
}
