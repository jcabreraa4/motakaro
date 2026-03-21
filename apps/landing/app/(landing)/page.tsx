import { Differentiation } from '@/components/main/differentiation';
import { Header } from '@/components/main/header';
import { Industries } from '@/components/main/industries';
import { Questions } from '@/components/main/questions';
import { Reveal } from '@/components/main/reveal';
import { Services } from '@/components/main/services';

export default function Page() {
  return (
    <main>
      <Header />
      <Industries />
      <Differentiation />
      <Reveal />
      <Services />
      <Questions />
    </main>
  );
}
