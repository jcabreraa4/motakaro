import { Differentiation } from '@/components/main/differentiation';
import { Industries } from '@/components/main/industries';
import { Questions } from '@/components/main/questions';
import { Services } from '@/components/main/services';
import { Pricing } from '@/components/main/pricing';
import { Header } from '@/components/main/header';
import { Reveal } from '@/components/main/reveal';

export default function Page() {
  return (
    <main>
      <Header />
      <Industries />
      <Differentiation />
      <Reveal />
      <Services />
      <Pricing />
      <Questions />
    </main>
  );
}
