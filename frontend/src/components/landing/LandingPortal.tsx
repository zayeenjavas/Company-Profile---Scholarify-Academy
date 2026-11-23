"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/src/api/client";
import type { TryoutPackageDto, UserDto } from "@/src/api/contracts";
import type { SanityMentor, SanityNews, SanityTestimonial } from "@/src/api/sanity";
import { mapPackageDto, mapUserDto } from "@/src/api/mappers";
import type { TryoutPackage, UserProfile } from "@/src/types/domain";
import { LandingNavbar } from "@/src/components/landing/LandingNavbar";
import { LandingHero } from "@/src/components/landing/LandingHero";
import { LandingPrograms } from "@/src/components/landing/LandingPrograms";
import { LandingAbout } from "@/src/components/landing/LandingAbout";
import { LandingPackages } from "@/src/components/landing/LandingPackages";
import { LandingDigitalProducts } from "@/src/components/landing/LandingDigitalProducts";
import { LandingMentors } from "@/src/components/landing/LandingMentors";
import { LandingTestimonialsAndNews } from "@/src/components/landing/LandingTestimonialsAndNews";
import { LandingContactFooter } from "@/src/components/landing/LandingContactFooter";
import { SmoothScrollProvider } from "@/src/components/common/SmoothScrollProvider";

interface LandingPortalProps {
  cmsData: {
    mentors: SanityMentor[];
    testimonials: SanityTestimonial[];
    news: SanityNews[];
  };
}

export function LandingPortal({ cmsData }: LandingPortalProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [packages, setPackages] = useState<TryoutPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, pkgRes] = await Promise.all([
          apiRequest<{ ok: boolean; user: UserDto }>("/auth/me").catch(() => null),
          apiRequest<{ packages: TryoutPackageDto[] }>("/packages").catch(() => ({
            packages: [],
          })),
        ]);
        if (meRes?.user) {
          setUser(mapUserDto(meRes.user));
        }
        setPackages(pkgRes.packages.map(mapPackageDto));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isSubscribed = Boolean(user?.subscription.isActive);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-background text-foreground pb-24 lg:pb-0">
      <LandingNavbar user={user} />
      <main>
        <LandingHero user={user} onSearchPackage={setSearchQuery} />
        <LandingPrograms />
        <LandingAbout />
        <LandingPackages
          packages={packages}
          loading={loading}
          isSubscribed={isSubscribed}
          searchQuery={searchQuery}
        />
        <LandingDigitalProducts searchQuery={searchQuery} />
        <LandingMentors mentors={cmsData.mentors} />
        <LandingTestimonialsAndNews
          isSubscribed={isSubscribed}
          testimonials={cmsData.testimonials}
          news={cmsData.news}
        />
      </main>
      <LandingContactFooter />
      </div>
    </SmoothScrollProvider>
  );
}
