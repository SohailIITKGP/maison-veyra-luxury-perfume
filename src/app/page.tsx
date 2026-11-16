import { BrandStory } from "@/components/home/BrandStory";
import { DiscoverySet } from "@/components/home/DiscoverySet";
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { ScentFinder } from "@/components/home/ScentFinder";
import { SignatureCollection } from "@/components/home/SignatureCollection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SignatureCollection />
      <BrandStory />
      <ScentFinder />
      <DiscoverySet />
      <Philosophy />
    </>
  );
}
