import { Exception } from '@workspace/branding/components/exception';

export default function NotFound() {
  return (
    <Exception
      code={404}
      text="Page not found"
    />
  );
}
