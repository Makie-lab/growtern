import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OfferingsSection from "@/components/OfferingsSection";
import CategoriesSection from "@/components/CategoriesSection";
import RoleBranch from "@/components/RoleBranch";
import RoleSearch from "@/components/RoleSearch";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <OfferingsSection />
      <CategoriesSection />
      <RoleBranch />
      <RoleSearch />
      <CTASection />
      <Footer />
    </>
  );
}
