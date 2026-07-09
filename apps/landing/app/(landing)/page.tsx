import { MainDoubts } from '@/components/main/main-doubts';
import { MainHeader } from '@/components/main/main-header';
import { MainHybrid } from '@/components/main/main-hybrid';
import { MainPricing } from '@/components/main/main-pricing';
import { MainReveal } from '@/components/main/main-reveal';
import { MainService } from '@/components/main/main-service';

export default function Page() {
  return (
    <>
      <MainHeader />
      <MainHybrid />
      <MainReveal />
      <MainService />
      <MainPricing />
      <MainDoubts />
    </>
  );
}
