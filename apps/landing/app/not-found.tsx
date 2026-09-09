import { ExceptionPage } from '@workspace/ui/components/custom/exception-page';

export default function NotFound() {
  return (
    <ExceptionPage
      code={404}
      text="Page not found"
    />
  );
}
