import { fetchLandingCmsData } from "@/src/api/sanity";
import { LandingPortal } from "@/src/components/landing/LandingPortal";

export default async function HomePage() {
  const cmsData = await fetchLandingCmsData();
  return <LandingPortal cmsData={cmsData} />;
}
