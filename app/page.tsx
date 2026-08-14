// app/page.tsx
import LenisProvider from '@/components/LenisProvider';
import ScrollProgress from '@/components/ScrollProgress';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FloatingGallery from '@/components/FloatingGallery';
import TracksSection from '@/components/TracksSection';
import SkillsSection from '@/components/SkillsSection';
import AwardsSection from '@/components/AwardsSection';
import ContactSection from '@/components/ContactSection';
import FooterSection from '@/components/FooterSection';

export default function Home() {
  return (
    <LenisProvider>
      <ScrollProgress />
      <main className="bg-black text-offwhite min-h-screen overflow-x-hidden">
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />
        <FloatingGallery />
        <TracksSection />
        <SkillsSection />
        <AwardsSection />
        <ContactSection />
        <FooterSection />
      </main>
    </LenisProvider>
  );
}

