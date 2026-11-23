import { fetchLandingCmsData } from "@/src/api/sanity";
import { LandingMentors } from "@/src/components/landing/LandingMentors";
import {
  PageShell,
  SplitPillButton,
  SubpageHero,
} from "@/src/components/ui-kit/ScholarifyKit";

export const revalidate = 60;

export default async function TimPage() {
  const { mentors } = await fetchLandingCmsData();

  return (
    <PageShell>
      <SubpageHero
        eyebrow="TIM & MENTOR SCHOLARIFY"
        titleLine1="Kenali Tim Pengajar"
        titleLine2Prefix="& Mentor"
        highlight="Terbaik"
        subtitle="Dipimpin oleh Founder & Tim Inti bersama barisan mentor berpengalaman dari berbagai PTN terbaik Indonesia."
        actions={<SplitPillButton href="/tryout" label="» Mulai TryOut" />}
      />
      <LandingMentors mentors={mentors} />
    </PageShell>
  );
}
